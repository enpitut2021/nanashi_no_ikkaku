
const isProduction = process.env.NODE_ENV === 'production'

// デバッグ時のみ出力するlog/error

exports.log = (message, ...args) => {
    if (!isProduction) console.log(message, args)
}

exports.error = (err) => {
    if (!isProduction) console.error(err)
}

// プロダクションビルドかによったお題表示時間

const odaiWaitTime = (isProduction) ? 30000 : 3000

exports.ODAI_WAIT_TIME = odaiWaitTime