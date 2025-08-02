const { getPlaiceholder } = require('plaiceholder')
const fs = require('fs')

;(async () => {
  // Change the path to your image!
  const buffer = fs.readFileSync('public/images/about/S__4956722_0.jpg')
  const { base64 } = await getPlaiceholder(buffer)

  // Output the result
  console.log(base64)
  // Optional: save to file for easy copy-paste
  fs.writeFileSync('blurDataURL.txt', base64)
})()
