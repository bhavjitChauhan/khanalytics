require('dotenv').config();
const axios = require('axios').default;
const { Router } = require('express');

const router = Router({ strict: true });


router.post('/', async (req, res) => {
    const { name, body } = req.body;
    if (!body) return;

    const data = JSON.stringify({
        "user_id": process.env.EMAILJS_USER_ID,
        "service_id": "khanalytics",
        "template_id": "contact_template",
        "template_params": {
            "name": name,
            "body": body
        },
        "accessToken": process.env.EMAILJS_ACCESS_TOKEN
    });
    const config = {
        method: 'post',
        url: 'https://api.emailjs.com/api/v1.0/email/send',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };
    await axios(config)
        .catch((error) => {
            console.error(error.response.data, error.response.status);
        });

    res.send('OK');
});


module.exports = router;
