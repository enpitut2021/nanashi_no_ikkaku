
const isProduction = process.env.NODE_ENV === 'production'

if (!isProduction)
    console.log("ビルド：デバッグ（コンソール出力あり）")
else
    console.log("ビルド：リリース（コンソール出力なし）")

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
