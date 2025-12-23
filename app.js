const express = require('express');
const app = express();
const port = 3000;
const axios = require('axios');
const path = require('path');

require('dotenv').config(); 

app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/' , (req , res) => {
    res.sendFile(path.join(__dirname , 'views' , 'index.html'))
});
app.get('/randomuser', async (req, res) => {
    try{ 
        //random user
        let response = await axios.get('https://randomuser.me/api/');  
        const user = response.data.results[0];
        
        //country info
        response = await axios.get(`https://restcountries.com/v3.1/name/${user.location.country}`)
        const country = response.data[0];

        const countryName = country.name.common;
        const currencyCode = Object.keys(country.currencies)[0];;
        
        //exchage rate
        response = await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGERATE_API_KEY}/latest/${currencyCode}`)
        const currencyExchange = response.data.conversion_rates
        
        //news
        response = await axios.get(`https://newsapi.org/v2/everything?q=${countryName}&language=en&apiKey=${process.env.NEWS_API_KEY}`)
        const news = response.data

        const filtered = news.articles.filter(a =>
        a.title &&
        a.title.toLowerCase().includes(countryName.toLowerCase())
        );

        const articles = filtered.slice(0, 5)
        .map(a => ({
            title: a.title,
            description: a.description,
            url: a.url,
            image: a.urlToImage ?? null
        }));

        const data = {
            name:{
                first: user.name.first,
                last: user.name.last
            },
            gender: user.gender,
            picture: user.picture.large,
            age: user.dob.age,
            dob: user.dob.date,
            location:
            {
                country: user.location.country,
                city: user.location.city,
                fulladdress: user.location.street.name + ' ' + user.location.street.number
            },
            country:
            {
                name: countryName,
                capital: country.capital[0],
                languages: country.languages,
                currency:  currencyCode,
                flag: country.flags.png,
            },
            currencyExchange:
            {
                toUSD: currencyExchange['USD'],
                toKZT: currencyExchange['KZT'],
            },
            articles,
        }

        res.send(data);

    }catch (error) {
        console.error('Error fetching data:', error);
    }
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
