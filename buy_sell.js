const body = document.body;
const dealOverlay = document.getElementById("dealOverlay");
const locationTitle = document.getElementById("locationTitle")
let darkness = document.getElementById("darkness");
const cityDay = document.getElementById("cityDay");
const cityCash = document.getElementById("cityCash");
const cityBank = document.getElementById("cityBank");
const cityDebt = document.getElementById("cityDebt");
const bsCash = document.getElementById("bsCash");
const capacity = document.getElementById("bsCapacity");
//const amount = document.getElementById("bsAmount");
const bsName = document.getElementById("bsName");
const bsPrice = document.getElementById("bsPrice");
const myPrice = document.getElementById("myPrice");
const buyButton = document.getElementById("buyButton");
const sellButton = document.getElementById("sellButton");
const bsSlider = document.getElementById("bsSlider");
const confirmTransactionButton = document.getElementById("primaryAction");
const cancelTransactionButton = document.getElementById("secondaryAction");
const specialButton = document.getElementById("specialButton");
const travelButton = document.getElementById("travelButton");
const travCancelButton = document.getElementById("travCancelButton");
const cashOutButton = document.getElementById("cashOutButton")
const sliderCounter = document.getElementById("sliderCounter");

const fmtMoney = Intl.NumberFormat("en-US", {
     style: "currency",
     currency: "USD",
     minimumFractionDigits: "0",
});

var buying = true;
var vDrugId = "";
var vName = "";
var vCost = 50;
var vAverage = 0;
var vCash = 1298;
var vHolding = 12;
var vCapacity = 100;
var vCashDelta = 0;
var vHoldingDelta = 0;
var vAmount = 0;
var vDay = 0;

var vCity = "";
enterCity("bos");
function enterCity(cityId) {
     if (vCity.length > 0) {
          body.classList.remove(vCity);
     }

     var cityData = document.getElementById("city-" + cityId);
     if (cityData != null && locationTitle != null) {
          vCity = cityId;
          locationTitle.innerHTML = cityData.dataset.name;
          specialButton.hidden = cityData.dataset.special == null;
     }

     vDay += 1;

     refreshValues();
     body.classList.add(vCity);

     if (vDay > 30) {
          // TODO end game
     }
}

function clickCity() {
     var event = window.event;
     if (event == null) {
          return;
     }

     var city = event.target;
     while (city != null && !city.classList.contains("location")) {
          city = city.parentElement;
     }

     if (city == null) {
          return;
     }

     if (city.dataset.to != vCity) {
          enterCity(city.dataset.to);
          refreshDrugs()
     }

     body.classList.remove("showTravel")
}

var cities = document.getElementsByClassName("location");
for (var i = 0; i < cities.length; i++) {
     cities[i].onclick = clickCity;
}

var bsDrugData = null;
var drugs = document.getElementsByClassName("drug");
refreshDrugs();
for (var i = 0; i < drugs.length; i++) {
     drugs[i].onclick = openDrug;
}

refreshWallet();
refreshDay();

function openDrug() {
     var event = window.event;
     if (event == null) {
          return;
     }

     var drug = event.target;
     while (drug != null && !drug.classList.contains("drug")) {
          drug = drug.parentElement;
     }

     if (drug == null) {
          return;
     }
     //console.log(drug.dataset.name);

     if (vDrugId.length > 0) {
          dealOverlay.classList.remove(vDrugId);
     }

     vDrugId = drug.dataset.name;
     dealOverlay.classList.add(vDrugId);

     var drugData = document.getElementById("ur-" + vDrugId);
     if (drugData == null) {
          return;
     }
     //console.log(drugData);

     var cityDrugData = document.getElementById("hist-" + vDrugId);
     if (cityDrugData == null) {
          return;
     }
     //console.log(cityDrugData);

     bsDrugData = document.getElementById("my-" + vDrugId);
     if (bsDrugData == null) {
          return;
     }
     //console.log(bsDrugData);

     var wallet = document.getElementById("wallet");

     vName = drugData.dataset.name;
     vCost = Number(cityDrugData.dataset.dayprice)
     vCash = Number(wallet.dataset.cash);
     vHolding = Number(bsDrugData.dataset.holding);
     vAverage = Number(bsDrugData.dataset.price);
     vCashDelta = 0;
     vHoldingDelta = 0;
     vAmount = 0;
     buying = true;
     body.classList.add("showDeal");
     bsSlider.max = vCapacity - vHolding;
     bsSlider.value = 0;
     refreshValues();
}

function transactionDirection() {
     return buying ? 1 : -1;
}

function positionCounter() {
     // Get the current value and max value of the slider
     var currentValue = parseFloat(bsSlider.value);
     var maxValue = parseFloat(bsSlider.max);

     // Calculate the percentage
     var percentage = (currentValue / maxValue) * 100;
     percentage *= 0.94;
     if (maxValue < 1) {
          percentage = 0
     }

     // Set the left position of the next element
     sliderCounter.style.left = percentage + "%";
}

function refreshDrugs() {
     var wallet = document.getElementById("wallet")
     for (var i = 0; i < drugs.length; i++) {
          var drug = drugs[i]
          var drugData = document.getElementById("ur-" + drug.dataset.name)
          var cityDrugData = document.getElementById("hist-" + drug.dataset.name)
          var myDrugData = document.getElementById("my-" + drug.dataset.name)
          if (drugData != null && myDrugData != null) {
               var children = drug.children
               for (var j = 0; j < children.length; j++) {
                    var child = children[j]
                    if (child.classList.contains("amount")) {
                         child.innerHTML = myDrugData.dataset.holding;
                    } else if (child.classList.contains("drugName")) {
                         child.innerHTML = drugData.dataset.name;
                    } else if (child.classList.contains("graph")) {
                         // TODO figure out histogram
                    } else if (child.classList.contains("price")) {
                         var basePrice = cityDrugData.dataset.price;
                         var dayPrice = basePrice
                         if (vDay > 1) {
                              var minPrice = basePrice / 2;
                              var maxPrice = basePrice * 2;
                              var dayPrice = (Math.random() * (maxPrice - minPrice)) + minPrice;
                              dayPrice = Math.floor(dayPrice);
                         }

                         child.innerHTML = fmtMoney.format(dayPrice);
                         cityDrugData.dataset.dayprice = dayPrice;
                    }
               }

               if (Number(drugData.dataset.dayprice) > Number(wallet.dataset.cash) && Number(myDrugData.dataset.holding) < 1) {
                    drug.classList.add("disabled")
               } else {
                    drug.classList.remove("disabled")
               }
          }
     }
}

function refreshValues() {
     if (buying) {
          sellButton.parentNode.classList.remove("toggled");
          confirmTransactionButton.innerHTML = "Buy";
     } else {
          sellButton.parentNode.classList.add("toggled");
          confirmTransactionButton.innerHTML = "Sell";
     }

     var cashTotal = vCash + vCashDelta;
     var holdingTotal = vHolding + vHoldingDelta;

     bsName.innerHTML = vName;
     bsPrice.innerHTML = fmtMoney.format(vCost);
     myPrice.innerHTML = fmtMoney.format(vAverage);
     bsCash.innerHTML = fmtMoney.format(cashTotal);
     capacity.innerHTML = holdingTotal + "/" + vCapacity;
     sliderCounter.innerHTML = vAmount;
     cityDay.innerHTML = vDay;
     positionCounter();
}

function refreshWallet() {
     cityCash.innerHTML = fmtMoney.format(wallet.dataset.cash);
     cityBank.innerHTML = fmtMoney.format(wallet.dataset.bank);
     cityDebt.innerHTML = fmtMoney.format(wallet.dataset.debt);
}

function refreshDay() {
     cityDay.innerHTML = vDay;
}

confirmTransactionButton.onclick = function () {
     var wallet = document.getElementById("wallet");
     wallet.dataset.cash = Number(wallet.dataset.cash) + Number(vCashDelta);

     var totalHolding = Number(bsDrugData.dataset.holding);
     var avg = totalHolding * vAverage;
     avg += vCost * vHoldingDelta;
     totalHolding += vHoldingDelta;
     if (totalHolding <= 0) {
          avg = 0;
     } else {
          avg /= totalHolding;
     }
     bsDrugData.dataset.holding = totalHolding;
     bsDrugData.dataset.price = avg;

     refreshWallet()
     refreshDrugs()
     body.classList.remove("showDeal");
};

function cancelTransaction() {
     body.classList.remove("showDeal");
     vCashDelta = 0;
     vHoldingDelta = 0;
}

cancelTransactionButton.onclick = cancelTransaction;
darkness.onclick = cancelTransaction;

buyButton.onclick = function () {
     buying = true;
     vAmount = 0;
     vCashDelta = 0;
     vHoldingDelta = 0;
     bsSlider.max = vCapacity - vHolding;
     bsSlider.value = 0;
     refreshValues();
};

sellButton.onclick = function () {
     buying = false;
     vAmount = 0;
     vCashDelta = 0;
     vHoldingDelta = 0;
     bsSlider.max = vHolding;
     bsSlider.value = 0;
     refreshValues();
};

bsSlider.oninput = function () {
     var totalHolding = vHolding + vHoldingDelta;
     var totalCash = vCash + vCashDelta;
     var direction = transactionDirection();

     while (vAmount < Number(bsSlider.value)) {
          var canInc = false;
          if (buying && vCash + vCashDelta >= vCost && vHolding + vHoldingDelta <= vCapacity) {
               canInc = true;
          } else if (!buying && vHolding + vHoldingDelta > 0) {
               canInc = true;
          }

          if (canInc) {
               vAmount += 1;
               vHoldingDelta += 1 * direction;
               vCashDelta -= vCost * direction;
          } else {
               break;
          }
     }

     while (vAmount > Number(bsSlider.value)) {
          vAmount -= 1;
          vHoldingDelta -= 1 * direction;
          vCashDelta += vCost * direction;
     }

     bsSlider.value = vAmount;
     refreshValues();
};

travelButton.onclick = function() {
     body.classList.add("showTravel");
}

travCancelButton.onclick = function() {
     body.classList.remove("showTravel");
}

refreshValues();
