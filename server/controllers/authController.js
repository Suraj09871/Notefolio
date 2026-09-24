const User = require("../models/User")
const jwt = require("jsonwebtoken")
const https = require("https")

const JWT_SECRET = process.env.JWT_SECRET || "notefolio_jwt_secret_key_2026_secure"

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "30d" })
}

// ==================== LOCAL AUTH ====================

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please provide name, email, and password" })
    }
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists with this email" })
    }
    const user = await User.create({ name, email, password, phone: phone || "", authProvider: "local" })
    const token = generateToken(user._id)
    res.status(201).json({
      success: true,
      data: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, avatar: user.avatar, authProvider: user.authProvider, token },
      message: "Registration successful",
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ success: false, message: "Registration failed", error: error.message })
  }
}

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" })
    }
    if (user.authProvider === "google" && !user.password) {
      return res.status(401).json({ success: false, message: "This account uses Google Sign-In. Please login with Google." })
    }
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" })
    }
    const token = generateToken(user._id)
    res.status(200).json({
      success: true,
      data: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, avatar: user.avatar, authProvider: user.authProvider, token },
      message: "Login successful",
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ success: false, message: "Login failed", error: error.message })
  }
}

// ==================== GOOGLE OAUTH 2.0 REDIRECT FLOW ====================

// Step 1: Redirect user to Google login page
exports.googleRedirect = (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const host = req.get('host') || 'localhost:3000'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const redirectUri = `${protocol}://${host}/api/auth/google/callback`
  
  if (!clientId) {
    console.error('❌ GOOGLE_CLIENT_ID is not configured')
    return res.redirect('/?google_error=' + encodeURIComponent('Google Sign-In is not configured'))
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
  })

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  console.log('🔐 Redirecting to Google login, callback:', redirectUri)
  res.redirect(googleAuthUrl)
}

// Step 2: Google redirects back here with an authorization code
exports.googleCallback = async (req, res) => {
  try {
    const { code, error: googleError } = req.query

    if (googleError) {
      console.error('❌ Google auth error:', googleError)
      return res.redirect('/?google_error=' + encodeURIComponent(googleError))
    }

    if (!code) {
      return res.redirect('/?google_error=no_code')
    }

    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const host = req.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const redirectUri = `${protocol}://${host}/api/auth/google/callback`

    if (!clientId || !clientSecret) {
      console.error('❌ Google OAuth credentials missing in environment')
      return res.redirect('/?google_error=' + encodeURIComponent('OAuth credentials missing'))
    }

    // Exchange code for tokens
    console.log('🔄 Exchanging code for tokens...')
    const tokenData = await httpPost('https://oauth2.googleapis.com/token', {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    })

    if (!tokenData.access_token) {
      console.error('❌ Token exchange failed:', tokenData)
      return res.redirect('/?google_error=token_exchange_failed')
    }

    // Get user info from Google
    console.log('🔄 Fetching user info...')
    const userInfo = await httpGet(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenData.access_token}`)

    if (!userInfo.email) {
      console.error('❌ No email in user info:', userInfo)
      return res.redirect('/?google_error=no_email')
    }

    console.log('✅ Google user:', userInfo.email, userInfo.name)

    // Find or create user in database
    let user = await User.findOne({ googleId: userInfo.id })

    if (!user) {
      user = await User.findOne({ email: userInfo.email })
      if (user) {
        user.googleId = userInfo.id
        user.avatar = userInfo.picture || user.avatar
        await user.save()
      } else {
        user = await User.create({
          name: userInfo.name || userInfo.email.split('@')[0],
          email: userInfo.email,
          googleId: userInfo.id,
          avatar: userInfo.picture || "",
          authProvider: "google",
        })
      }
    } else {
      user.avatar = userInfo.picture || user.avatar
      await user.save()
    }

    const token = generateToken(user._id)

    // Redirect back to frontend with token in URL
    const userData = encodeURIComponent(JSON.stringify({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      avatar: user.avatar,
      authProvider: user.authProvider,
      token,
    }))

    console.log('✅ Google login successful for:', user.email)
    res.redirect(`/?google_auth=${userData}`)
  } catch (error) {
    console.error('Google callback error:', error)
    res.redirect('/?google_error=' + encodeURIComponent(error.message))
  }
}

// Helper: HTTPS POST (form-encoded)
function httpPost(url, data) {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams(data).toString()
    const urlObj = new URL(url)
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    }
    const req = https.request(options, (resp) => {
      let body = ''
      resp.on('data', chunk => body += chunk)
      resp.on('end', () => {
        try { resolve(JSON.parse(body)) } catch (e) { reject(new Error('Invalid JSON: ' + body.substring(0, 200))) }
      })
    })
    req.on('error', reject)
    req.write(postData)
    req.end()
  })
}

// Helper: HTTPS GET
function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (resp) => {
      let body = ''
      resp.on('data', chunk => body += chunk)
      resp.on('end', () => {
        try { resolve(JSON.parse(body)) } catch (e) { reject(new Error('Invalid JSON')) }
      })
    }).on('error', reject)
  })
}

// ==================== PROFILE ====================

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    if (!user) return res.status(404).json({ success: false, message: "User not found" })
    res.status(200).json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch profile", error: error.message })
  }
}

exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ success: false, message: "User not found" })
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.phone = req.body.phone || user.phone
    if (req.body.password) user.password = req.body.password
    const updatedUser = await user.save()
    res.status(200).json({
      success: true,
      data: {
        id: updatedUser._id, name: updatedUser.name, email: updatedUser.email,
        phone: updatedUser.phone, role: updatedUser.role, avatar: updatedUser.avatar,
        authProvider: updatedUser.authProvider, token: generateToken(updatedUser._id),
      },
      message: "Profile updated successfully",
    })
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update profile", error: error.message })
  }
}

// ==================== ADMIN: USER MANAGEMENT ====================

exports.getAllUsers = async (req, res) => {
  try {
    // Only admin can get all users
    if (req.user.role !== 'admin' && !req.user.isAdminToken) {
      return res.status(403).json({ success: false, message: "Not authorized as admin" })
    }
    const users = await User.find({}).select("-password").sort("-createdAt")
    res.status(200).json({ success: true, count: users.length, data: users })
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch users", error: error.message })
  }
}

exports.deleteUser = async (req, res) => {
  try {
    // Only admin can delete users
    if (req.user.role !== 'admin' && !req.user.isAdminToken) {
      return res.status(403).json({ success: false, message: "Not authorized as admin" })
    }
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ success: false, message: "User not found" })
    
    // Prevent deleting other admins
    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: "Cannot delete admin users" })
    }
    
    await user.deleteOne()
    res.status(200).json({ success: true, message: "User deleted successfully" })
  } catch (error) {
    console.error("Delete user error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    })
  }
}

// Remove a purchased note from user profile
exports.removePurchasedNote = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { noteId } = req.params;
    
    const initialLength = user.purchasedNotes.length;
    user.purchasedNotes = user.purchasedNotes.filter(
      (note) => note.noteId.toString() !== noteId
    );

    if (user.purchasedNotes.length === initialLength) {
      return res.status(404).json({ success: false, message: "Note not found in your library" });
    }

    await user.save();
    
    res.status(200).json({ success: true, message: "Note removed from your library successfully" });
  } catch (error) {
    console.error("Remove purchased note error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove note",
      error: error.message,
    });
  }
}
