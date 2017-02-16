/**
 * Created by Maziar on 10/12/2015.
 */

var cart = {};
var inactiveTime = 0;
var totalPrice = 0;
var serverURL = "https://cpen400a.herokuapp.com/products";

var setIntervalVal = setInterval(function(){inactiveTimer()}, 1000);

var products = {
    "Box1" : {'price' : 10, 'quantity' : 10},
    "Box2": {'price' : 5, 'quantity' : 10},
    "Clothes1": {'price' : 20, 'quantity' : 10},
    "Clothes2": {'price' : 30, 'quantity' : 10},
    "Jeans": {'price' : 50, 'quantity' : 10},
    "Keyboard": {'price' : 20, 'quantity' : 10},
    "KeyboardCombo": {'price' : 40, 'quantity' : 10},
    "Mice": {'price' : 20, 'quantity' : 10},
    "PC1": {'price' : 350, 'quantity' : 10},
    "PC2": {'price' : 400, 'quantity' : 10},
    "PC3": {'price' : 300, 'quantity' : 10},
    "Tent": {'price' : 100, 'quantity' : 10}
};
console.log(products);
ajaxSetup();

function helper(productName) {
    return function () {
        //console.log("helper" + productName);
        showOrHide(productName);
    };
}
function helperAddToCard(productName) {
    return function () {
        //console.log("helperAddToCard" + productName);
        addToCart(productName);
    };
}
function helperRemoveCard(productName) {
    return function () {
        console.log("helperRemoveCard" + productName);
        removeFromCart(productName);
    };
}

function productsInitializer(){
    // Get the list and empty it:
    var ul = document.getElementById("productListul");
    console.log(ul);
    ul.innerHTML ="";

    var product;
    var url = "";
    var price = 121;
    var quantity = 10;

    for (product in products) {
        url = products[product]['url'];
        price = products[product]['price'];
        quantity = products[product]['quantity'];


        // Write:
        var li = document.createElement("li");
        li.className = product;

        li.addEventListener("mouseover", helper(product));

        var img1 = document.createElement("img");
        img1.className = "product";
        img1.src = url;
        li.appendChild(img1);

        var img2 = document.createElement("img");
        img2.className = "cartSymbol";
        img2.src = "images/cart.png";
        li.appendChild(img2);

        var divTemp = document.createElement("div");
        divTemp.className = "add";
        divTemp.innerHTML = "Add";


        divTemp.addEventListener("click", helperAddToCard(product));
        li.appendChild(divTemp);

        divTemp = document.createElement("div");
        divTemp.className = "remove";
        divTemp.innerHTML = "Remove";


        divTemp.addEventListener("click", helperRemoveCard(product));
        li.appendChild(divTemp);

        divTemp = document.createElement("div");
        divTemp.className = "price";
        divTemp.innerHTML = price;
        li.appendChild(divTemp);

        divTemp = document.createElement("div");
        divTemp.className = "name";
        divTemp.innerHTML = product;
        li.appendChild(divTemp);

        ul.appendChild(li);
    }
}


function ajaxSetup() {
    var numberOfTry = 0;
    var success = false;
    function ajaxHandler() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", serverURL);
        xhr.onload = function () {
            if (xhr.status == 200) {
                console.log("Received " + xhr.responseText);
                jsonResponceString = xhr.responseText;
                jsonResponce = JSON.parse(jsonResponceString);
                console.log(jsonResponce);
                products = jsonResponce;
                productsInitializer();
                success = true;
            } else {
                console.log("Received error code: " + xhr.status);
                success = false;
                ajaxHandler();
            }
        };
        xhr.ontimeout = function () {
            console.log("Timed out after " + xhr.timeout + " ms");
            success = false;
            ajaxHandler();
        };
        xhr.onerror = function () {
            console.log("Resulted in an error !");
            success = false;
            ajaxHandler();
        };
        xhr.onabort = function () {
            console.log("Aborted");
            success = false;
            ajaxHandler();
        };
        if (success == false) {
            if (numberOfTry < 10) {
                console.log(numberOfTry);
                numberOfTry++;
                xhr.timeout = 5000;
                xhr.send();
            } else{
                alert("Server unreachable at the moment. Try again later...");
                return;
            }
        }
    }
    ajaxHandler();
}

function inactiveTimer(){
    if(inactiveTime >= 300) {
        alert("Hey there! Are you still planning to buy something?");
        inactiveTime = 0;
    }
    else
        inactiveTime++;

    document.getElementById("inactiveTimerInFooter").innerHTML = "Inactive time: " + inactiveTime +"s";
    //console.log(inactiveTime);
}

function addToCart(productName) {
    inactiveTime = 0;
    if (products[productName]['quantity'] > 0) {
        if (productName in cart)
            cart[productName]++;
        else
            cart[productName] = 1;

        totalPrice += products[productName]['price'];
        products[productName]['quantity']--;
    }
    console.log(cart);
    buttonUpdate();
    showOrHide(productName);
}

function removeFromCart(productName) {
    inactiveTime = 0;
    if(productName in cart){
        if (cart[productName]>0) {
            cart[productName]--;
            totalPrice -= products[productName]['price'];
            products[productName]['quantity']++;
        }

        if (cart[productName]==0)
            delete cart[productName];

    }
    console.log(cart);
    buttonUpdate();
    showOrHide(productName);
}

function showOrHide(productName){
    var list = document.getElementsByClassName(productName);
    console.log(productName);
    var addButton = list[0].getElementsByClassName("add")[0];
    var removeButton = list[0].getElementsByClassName("remove")[0];

    addButton.style.visibility = "initial";
    removeButton.style.visibility = "initial";

    if (products[productName]['quantity']==0) {
        //console.log("quantity 0");
        addButton.style.visibility = "hidden";
    } else {
        addButton.style.visibility = "initial";
    }

    if (productName in cart == false){
        //console.log("no product in the cart");
        removeButton.style.visibility = "hidden";
    } else {
        removeButton.style.visibility = "initial";
    }

    //console.log(addButton);
    //console.log(removeButton);
}

function makeCart(){
    // Get the table:
    var myTable = document.getElementById("productsTable");
    //Empty the table:
    while(myTable.rows.length > 0) {
        myTable.deleteRow(0);
    }
    // Get the p:
    var theP = document.getElementById("inModal");
    //Empty the p:
    while(theP.firstChild){
        theP.removeChild(theP.firstChild);
    }

    // Write:
    if (totalPrice > 0) {
        // First Row of the table:
        var row = myTable.insertRow(0);
        row.className = "boldTextInTable";
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);

        var newText = document.createTextNode("Product Name");
        cell1.appendChild(newText);
        var newText = document.createTextNode("Quantity");
        cell2.appendChild(newText);
        var newText = document.createTextNode("Price");
        cell3.appendChild(newText);
        var newText = document.createTextNode("Total Price for this item");
        cell4.appendChild(newText);


        // Other Rows:
        var counter = 1;
        var item;
        for (item in cart) {
            var row = myTable.insertRow(counter++);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);

            var newText = document.createTextNode(item);
            cell1.appendChild(newText);

            var btn = document.createElement("BUTTON");
            btn.addEventListener("click", tableRemove(item));
            var t = document.createTextNode("-");
            btn.appendChild(t);
            cell2.appendChild(btn);

            newText = document.createTextNode(cart[item]);
            cell2.appendChild(newText);

            btn = document.createElement("BUTTON");
            btn.addEventListener("click", tableAdd(item));
            t = document.createTextNode("+");
            btn.appendChild(t);
            cell2.appendChild(btn);

            newText = document.createTextNode(products[item]['price']);
            cell3.appendChild(newText);

            var priceCalculations = products[item]['price'] * cart[item];
            newText = document.createTextNode(priceCalculations);
            cell4.appendChild(newText);
        }

        // Last Row of the table:
        var row = myTable.insertRow(counter);
        row.className = "boldTextInTable";
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);

        var newText = document.createTextNode("Total Price for everything: ");
        cell1.appendChild(newText);
        var newText = document.createTextNode("");
        cell2.appendChild(newText);
        var newText = document.createTextNode("");
        cell3.appendChild(newText);
        var newText = document.createTextNode(totalPrice);
        cell4.appendChild(newText);
    } else {
        // Writing in modal:
        var newText = document.createTextNode("The shopping cart is empty.");
        theP.appendChild(newText);
    }

    // Button:
    var footer = document.getElementById("modal-footer");
    footer.innerHTML = "";

    if (totalPrice > 0) {
        //Insert Button:
        var btn = document.createElement("button");
        btn.className = "btn btn-default";
        btn.id = "checkOutButton";
        btn.innerHTML = "Check out";
        btn.addEventListener("click", function(){modalButtonOnClick()});
        footer.appendChild(btn);
    }
}

function modalButtonOnClick(){
    console.log("modalButtonOnClick");
    alert("Confirming the availability and the price of the items in the store");
    var msg = "";
    var products2;

    //Send another AJAX msg, connect to server again and update products2
    function ajaxSetup2() {
        var numberOfTry = 0;
        var success = false;
        function ajaxHandler2() {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", serverURL);
            xhr.onload = function () {
                if (xhr.status == 200) {
                    console.log("Received " + xhr.responseText);
                    jsonResponceString = xhr.responseText;
                    jsonResponce = JSON.parse(jsonResponceString);
                    console.log(jsonResponce);
                    products2 = jsonResponce;
                    success = true;

                    console.log(products2);
                    //cart["PC1"] = 1000; // just for testing
                    console.log(cart);

                    //// Compare prices and quantities
                    //for (p1 in cart) {
                    //    for (p2 in products2) {
                    //        if (p1 == p2) {
                    //            // Price
                    //            if (products[p1]['price'] != products2[p2]['price']){
                    //                console.log('Price Change');
                    //                msg += "The price for product " + p1 +
                    //                    " has changed form " + products[p1]['price'] +
                    //                    " to " + products2[p2]['price'] + "\n";
                    //                products[p1]['price'] = products2[p2]['price'];
                    //                makeCart();
                    //            }
                    //            // Quantity
                    //            if (cart[p1] > products2[p2]['quantity']){
                    //                console.log('Quantity Change');
                    //                msg += "There wasn't enough " + p1 + " available in the stocks. " +
                    //                "You wanted " + cart[p1] + " but we only had " +
                    //                    products2[p2]['quantity'] + "\n";
                    //                cart[p1] = products2[p2]['quantity'];
                    //                products[p1]['quantity'] = 0;
                    //                makeCart();
                    //            }
                    //            updateTotalPrice();
                    //        }
                    //    }
                    //}
                    //console.log(msg);
                    //if (msg == ""){
                    //    alert("Everything good! No price change. All quantity wanted available.");
                    //}else {
                    //    alert(msg);
                    //}

                    alert("Check out Done! You spent $" + totalPrice);

                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.open("POST", server);
                    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    xmlhttp.send(JSON.stringify(cart + totalPrice));

                    cart = {};
                    makeCart();

                } else {
                    console.log("Received error code: " + xhr.status);
                    success = false;
                    ajaxHandler2();
                }
            };
            xhr.ontimeout = function () {
                console.log("Timed out after " + xhr.timeout + " ms");
                success = false;
                ajaxHandler2();
            };
            xhr.onerror = function () {
                console.log("Resulted in an error !");
                success = false;
                ajaxHandler2();
            };
            xhr.onabort = function () {
                console.log("Aborted");
                success = false;
                ajaxHandler2();
            };
            if (success == false) {
                if (numberOfTry < 10) {
                    console.log(numberOfTry);
                    numberOfTry++;
                    xhr.timeout = 5000;
                    xhr.send();
                } else{
                    alert("Server unreachable at the moment. Try again later...");
                    return;
                }
            }
        }
        ajaxHandler2();
    }
    ajaxSetup2();


}

function tableAdd(productName){
    return function() {
        console.log("tableAdd " + productName);
        addToCart(productName);
        makeCart();
    };
}

function tableRemove(productName){
    return function() {
        console.log("tableRemove " + productName);
        removeFromCart(productName);
        makeCart();
    };
}

function buttonUpdate() {
    var cartButton = document.getElementById("showcart").firstChild;
    cartButton.data = "Cart (" + totalPrice + ")";
}

function updateTotalPrice(){
    var temp = 0;
    for (p in cart){
        temp += products[p]['price'];
    }
    totalPrice = temp;
}