import { shared, env } from '@appblocks/node-sdk'

env.init()
const handler = async (event) => {
  const { req, res } = event

  const {
    sendResponse,
    getBody,
    prisma,
    validateRequestMethod,
    checkHealth,
    isEmpty,
    redis,
    generateRandomString,
  } = await shared.getShared()
  try {
    // health check
    if (checkHealth(req, res)) return

    await validateRequestMethod(req, ['POST'])

    const requestBody = await getBody(req)

    if (
      isEmpty(requestBody) ||
      !requestBody.hasOwnProperty('email') ||
      !requestBody.hasOwnProperty('otp') ||
      requestBody?.otp?.length !== 6
    ) {
      return sendResponse(res, 400, {
        message: 'Please provide a valid Email and OTP',
      })
    }

    const user_account = await prisma.user_account.findFirst({
      where: {
        email: requestBody.email,
      },
      include: { user: true },
    })

    if (!user_account) {
      return sendResponse(res, 400, {
        message: 'Please enter a valid user id',
      })
    }

    const { user } = user_account

    // Retrieve the value of the key
    if (!redis.isOpen) await redis.connect()
    const otp = await redis.get(`${user_account.id}_otp`)
    await redis.disconnect()

    if (otp !== requestBody.otp) {
      return sendResponse(res, 400, {
        message: 'Invalid OTP. Please try again or generate new otp',
      })
    }

    const updatedUser = await prisma.user_account.update({
      where: {
        id: user_account.id,
      },
      data: {
        is_email_verified: true,
        updated_at: new Date(),
      },
    })

    if (updatedUser) {
      const userAuthToken = generateRandomString(32)
      // Store the otp with an expiry stored in env.function in seconds
      if (!redis.isOpen) await redis.connect()
      await redis.set(userAuthToken, user_account.id, {
        EX: Number(process.env.BB_AUTH_OTP_EXPIRY_TIME_IN_SECONDS),
      })
      await redis.disconnect()

      return sendResponse(res, 200, {
        data: { user_auth_token: userAuthToken },
        message: 'OTP verified successfully',
      })
    }

    return sendResponse(res, 400, {
      message: 'Invalid OTP. Please try again or generate new otp',
    })
  } catch (e) {
    console.log(e.message)
    if (e.errorCode && e.errorCode < 500) {
      return sendResponse(res, e.errorCode, {
        message: e.message,
      })
    } else {
      return sendResponse(res, 500, {
        message: 'failed',
      })
    }
  }
}

export default handler
