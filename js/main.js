$(document).ready(function () {

    let basket = [];

    if (JSON.parse(localStorage.getItem('basketProd')) !== null) {
        basket = JSON.parse(localStorage.getItem('basketProd'));
        updateBasket();
    }

    function updateBasket() {
        for (let i = 0; i < basket.length; i++) {
            let prodItem = ('' +
                '<div class="basket_shop-list-item"><div class="close _delete"><img src="img/close.png" alt=""></div><p class="name">'
                + basket[i].name
                + '</p><span class="counter">' + basket[i].count + '</span><div class="price">'
                + basket[i].price
                + '</div></div>' +
                '');
            $(".basket_shop-list").append(prodItem);
        }
        updatePrice();
    };

    function updatePrice() {
        let summ = 0,
            priceInt = 0,
            counterProd = 0;

        $('.basket_shop-list-item').each(function () {
            priceInt = parseInt($(this).find('.price').text());
            counterProd = parseInt($(this).find('.counter').text());
            if (counterProd > 0) {
                summ += priceInt * counterProd;
            } else {
                summ += priceInt;
            }
        });

        $('.basket_sum ._result_sum').text(summ);
    };


    $('.add-product').on('click', function (e) {
        e.preventDefault();
        let parents = $(this).parents('.product-list_item');
        let productName = parents.find('.name').text().trim();
        let productPrice = parents.find('.price').text().trim();
        let productCount = 1;

        for (let i = 0; i < basket.length; i++) {
            if (productName === basket[i].name) {
                basket[i].count = basket[i].count + 1;
                productCount = basket[i].count;
                $('.basket_shop-list-item .name:contains(' + productName + ')').siblings('.counter').text(basket[i].count);
                localStorage.setItem('basketProd', JSON.stringify(basket));
                updatePrice();
                return false;
            }
        }

        let prodItem = (
            '<div class="basket_shop-list-item"><div class="close _delete"><img src="img/close.png" alt=""></div><p class="name">'
            + productName
            + '</p><span class="counter">' + productCount + '</span><div class="price">'
            + productPrice
            + '</div></div>'
        );

        $(".basket_shop-list").append(prodItem);

        basket.push({
            name: productName,
            price: productPrice,
            count: productCount
        });

        localStorage.setItem('basketProd', JSON.stringify(basket));

        updatePrice();
    });

    $(document).on('click', '._delete', function (e) {
        e.preventDefault();
        let parent = $(this).parent();
        let productName = parent.find('.name').text().trim();
        let parentCount = parent.find('.counter').text().trim();
        for (let i = 0; i < basket.length; i++) {
            if (productName === basket[i].name) {
                parentCount = parentCount - 1;
                parent.find('.counter').text(parentCount);
                basket[i].count = Number(parentCount);

                if (parentCount === 0) {
                    parent.remove();
                    basket = [];

                    $('.basket_shop-list-item').each(function () {
                        let productName = $(this).find('.name').text().trim();
                        let productPrice = $(this).find('.price').text().trim();
                        let productCount = parseInt($(this).find('.counter').text());
                        basket.push({
                            name: productName,
                            price: productPrice,
                            count: productCount
                        });
                    });
                }

                localStorage.setItem('basketProd', JSON.stringify(basket));
                updatePrice();
            }
        }
    });

    $('._order').on('click', function (e) {
        e.preventDefault();
        let basketName = $('.basket_shop-list-item .name');
        let totalPrice = $('.basket_sum ._result_sum').text();
        let alertList = [];
        basketName.each(function () {
            alertList.push($(this).text());
        });
        alert('Вы добавили в корзину ' + alertList.join(', ') + ' на сумму ' + totalPrice + '');
    })

});

// "Вы добавили в корзину [список продуктов] на сумму [итоговая сумма]"

$(window).on('load', function () {
    var offsetBasket = $('.basket').offset().top;
    var scrollTop = $(window).scrollTop();

    $(window).on('scroll', function () {
        let $basket = $('.basket-wrapper');
        scrollTop = $(window).scrollTop();
        if (scrollTop < offsetBasket) {
            $basket.removeClass('_fixed');
        } else {
            $basket.addClass('_fixed');
        }
    });
});