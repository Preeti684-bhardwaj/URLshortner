const validUrl = require('valid-url')
const shortId = require('shortid')
const urlModel = require('../model/urlmodel')

const createUrlshorten = async (req, res) => {
    try {
        let data = req.body

        const dbData = await urlModel.findOne({ longUrl: data.longUrl }).select({ _id: 0, longUrl: 1, shortUrl: 1, urlCode: 1 })

        if (dbData) {
            res.status(201).send({ status: true, data: dbData })
        } else {

            let shortCode = shortId.generate().toLocaleLowerCase()
            const code = await urlModel.findOne({ urlCode: shortCode })

            if (code) {
                shortCode = shortId.generate().toLocaleLowerCase()
            }

            data.urlCode = shortCode
            const isValid = validUrl.isUri(data.longUrl)

            if (!data.longUrl) return res.status(400).send({ status: false, message: "Please, Provide URL" })
            if (!isValid) return res.status(400).send({ status: false, message: "Please, Provide valid URL" })

            data.shortUrl = `http://localhost:3000/${data.urlCode}`

            await urlModel.create(data)
            const saveData = await urlModel.findOne(data).select({ _id: 0, longUrl: 1, shortUrl: 1, urlCode: 1 })
            res.status(201).send({ status: true, data: saveData })

        }

    } catch (error) {
        console.log("controller", error);
        res.status(500).send({ status: false, message: error })
    }
}

module.exports.createUrlshorten = createUrlshorten