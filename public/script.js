$(document).ready(function(){
	const $icon = $('#icon')
	const $name = $('#name')
	const $surname = $('#surname')
	const $gender = $('#gender')
	const $age = $('#age')
	const $dob = $('#dob')
	const $country = $('#country')
	const $city = $('#city')
	const $address = $('#address')

	const $capital = $('#capital')
	const $currency = $('#currency')
	const $articles = $('#articles')

	const $exchangeUSD = $('#exchange_usd')
	const $exchangeKZT = $('#exchange_kzt')

	const $flag = $('#flag')

	init();

	function init()
	{
		$icon.html('<img src="/images/user.png" alt="Аватар" class="profile_icon_img" id="icon">')
		$name.text('Erkhan');
		$surname.text('Piriyev');
		$gender.text('Male');
		$age.text('19');
		$dob.text('15.02.2007');
		$country.text('KZ');
		$city.text('Shym');
		$address.text('147BN');
	}

	$('#randomuser_button').click(function(){
		$.ajax({
			url: "/randomuser",
			dataType: "json",
			success: function(result)
			{
				$icon.html(`<img src="${result.picture}" alt="Аватар" class="profile_icon_img" id="icon">`)
				$name.text(result.name.first);
				$surname.text(result.name.last);
				$gender.text(result.gender);
				$age.text(result.age);
				$dob.text( new Date(result.dob).toLocaleDateString('ru-RU'));
				$country.text(result.location.country);
				$city.text(result.location.city);
				$address.text(result.location.fulladdress);

				$capital.text(result.country.capital);
				$currency.text(
					`${result.country.currency}`
				);

				$exchangeUSD.text(`1 ${result.country.currency} = ${result.currencyExchange.toUSD} USD`);
				$exchangeKZT.text(`1 ${result.country.currency} = ${result.currencyExchange.toKZT} KZT`);

				$flag.html(`<img src="${result.country.flag}" alt="Flag" class="profile_flag_img">`);

				$articles.empty();

				result.articles.forEach(article => {
					$articles.append(`
						<div class="article_card">
							${article.image ? `<img src="${article.image}" class="article_img">` : ``}
							<div class="article_body">
								<a href="${article.url}" target="_blank" class="article_title">
									${article.title}
								</a>
								<div class="article_desc">
									${article.description}
								</div>
							</div>
						</div>
					`);
				});

			}
		});
	});
});

