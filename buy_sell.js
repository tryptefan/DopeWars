const body = document.body;
const popup = document.getElementById("eventPopup");
const dealOverlay = document.getElementById("dealOverlay");
const locationTitle = document.getElementById("locationTitle");
let darkness = document.getElementById("darkness");
const cityDay = document.getElementById("cityDay");
const cityCash = document.getElementById("cityCash");
const cityBank = document.getElementById("cityBank");
const cityDebt = document.getElementById("cityDebt");
const dealCash = document.getElementById("dealCash");
const capacity = document.getElementById("dealCapacity");
//const amount = document.getElementById("dealAmount");
const dealName = document.getElementById("dealName");
const dealPrice = document.getElementById("dealPrice");
const dealSlider = document.getElementById("dealSlider");
const dealSliderCounter = document.getElementById("dealSliderCounter");
const myPrice = document.getElementById("myPrice");
const buyButton = document.getElementById("buyButton");
const sellButton = document.getElementById("sellButton");
const confirmDealButton = document.getElementById("confirmDeal");
const cancelDealButton = document.getElementById("cancelDeal");

const bankCash = document.getElementById("bankCash");
const bankBank = document.getElementById("bankBank");
const bankSlider = document.getElementById("bankSlider");
const bankSliderCounter = document.getElementById("bankSliderCounter");
const depositButton = document.getElementById("depositButton");
const withdrawButton = document.getElementById("withdrawButton");
const confirmBankButton = document.getElementById("confirmBank");
const cancelBankButton = document.getElementById("cancelBank");

const loanCash = document.getElementById("loanCash");
const loanDebt = document.getElementById("loanDebt");
const loanSlider = document.getElementById("loanSlider");
const loanSliderCounter = document.getElementById("loanSliderCounter");
const payButton = document.getElementById("payButton");
const borrowButton = document.getElementById("borrowButton");
const confirmLoanButton = document.getElementById("confirmLoan");
const cancelLoanButton = document.getElementById("cancelLoan");

const specialButton = document.getElementById("specialButton");
const travelButton = document.getElementById("travelButton");
const travCancelButton = document.getElementById("travCancelButton");
const cashOutButton = document.getElementById("cashOutButton");

const messageTitle = document.getElementById("messageTitle");
const messageBody = document.getElementById("messageBody");
const messageActionsSolo = document.getElementById("messageActionsSolo");
const messageActionsDouble = document.getElementById("messageActionsDouble");
const messageButton = document.getElementById("messageButton");
const messageButton1 = document.getElementById("messageButton1");
const messageButton2 = document.getElementById("messageButton2");

const eventChance = document.getElementById("chance-event");
const buySetupChance = document.getElementById("chance-buySetup");
const sellSetupChance = document.getElementById("chance-sellSetup");

const fmtMoney = Intl.NumberFormat("en-US", {
     style: "currency",
     currency: "USD",
     minimumFractionDigits: "0",
});

var buying = true;
var depositing = true;
var paying = true;
var vDrugId = "";
var vName = "";
var vCost = 50;
var vAverage = 0;
var vCash = 1298;
var vBank = 0;
var vDebt = 0;
var vHolding = 12;
var vCapacity = 100;
var vCashDelta = 0;
var vBankDelta = 0;
var vDebtDelta = 0;
var vHoldingDelta = 0;
var vAmount = 0;
var vDay = 0;

var vCity = "";

function lastDayPassed() {
     return vDay > 30;
}

function enterCity(cityId) {
     clearBodyClasses();
     if (vCity.length > 0) {
          body.classList.remove(vCity);
     }

     var cityData = document.getElementById("city-" + cityId);
     if (cityData != null && locationTitle != null) {
          vCity = cityId;
          locationTitle.innerHTML = cityData.dataset.name;
          if (cityData.dataset.special == null) {
               specialButton.style.display = "none";
          } else {
               specialButton.style.display = "block";
               var specialData = document.getElementById("special-" + cityData.dataset.special);
               if (specialData != null) {
                    specialButton.innerHTML = specialData.dataset.name;
                    specialButton.dataset.host = cityData.dataset.special;
               }
          }
     }

     vDay += 1;

     refreshDealValues();
     body.classList.add(vCity);

     if (lastDayPassed()) {
          // TODO end game
     }
}

function attemptEvent() {
     if (!lastDayPassed()) {
          var eventRoll = Math.random();
          if (eventRoll < eventChance.dataset.anyshow) {
               var bigRoll = Math.random();
               if (bigRoll < eventChance.dataset.bigshow) {
                    showBigEvent();
               }
               else {
                    showSmallEvent();
               }
          }
     }
}

function clickCity() {
     var event = window.event;
     if (event == null || event.target == null) {
          return;
     }

     var city = event.target;

     // ben's code
     transit(city);

     while (city != null && !city.classList.contains("location")) {
          city = city.parentElement;
     }

     if (city == null) {
          return;
     }
}

var cities = document.getElementsByClassName("location");
for (var i = 0; i < cities.length; i++) {
     cities[i].onclick = clickCity;
}

var dealDrugData = null;
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

     dealDrugData = document.getElementById("my-" + vDrugId);
     if (dealDrugData == null) {
          return;
     }
     //console.log(dealDrugData);

     var wallet = document.getElementById("wallet");

     vName = drugData.dataset.name;
     vCost = Number(cityDrugData.dataset.dayprice);
     vCash = Number(wallet.dataset.cash);
     vHolding = Number(dealDrugData.dataset.holding);
     vAverage = Number(dealDrugData.dataset.price);
     vCashDelta = 0;
     vHoldingDelta = 0;
     vAmount = 0;
     buying = true;
     clearBodyClasses();
     body.classList.add("showDeal");
     dealSlider.max = vCapacity - vHolding;
     dealSlider.value = 0;
     refreshDealValues();
}

function dealDirection() {
     return buying ? 1 : -1;
}

function bankDirection() {
     return depositing ? 1 : -1;
}

function loanDirection() {
     return paying ? 1 : -1;
}

function positionCounter(slider, sliderCounter) {
     // Get the current value and max value of the slider
     var currentValue = parseFloat(slider.value);
     var maxValue = parseFloat(slider.max);

     // Calculate the percentage
     var percentage = (currentValue / maxValue) * 100;
     //percentage *= 0.94; // 94
     if (maxValue < 1) {
          percentage = 0;
     }

     // ben's shitty hax---------------

     // Get the width of the counter element in pixels
     var counterWidth = sliderCounter.offsetWidth;

     // Select the parent element
     var parent = sliderCounter.parentElement;

     // Get the width of the parent element in pixels
     var parentWidth = parent.offsetWidth;

     // Calculate the maximum left position in pixels
     var maxLeftPx = parentWidth - counterWidth;

     // Calculate the left position in pixels based on the value (0-100%)
     var leftPx = (percentage / 100) * maxLeftPx;

     // Set the left position of the butterfly element in pixels
     sliderCounter.style.left = leftPx + "px";

     // end ben code -----------------

     // Set the left position of the next element
     // sliderCounter.style.left = percentage + "%"; // forgive me Sam
     //console.log(sliderCounter);
}

function refreshDrugs() {
     var wallet = document.getElementById("wallet");
     for (var i = 0; i < drugs.length; i++) {
          var drug = drugs[i];
          var drugData = document.getElementById("ur-" + drug.dataset.name);
          var cityDrugData = document.getElementById("hist-" + drug.dataset.name);
          var myDrugData = document.getElementById("my-" + drug.dataset.name);
          if (drugData != null && myDrugData != null) {
               var children = drug.children;
               for (var j = 0; j < children.length; j++) {
                    var child = children[j];
                    if (child.classList.contains("amount")) {
                         child.innerHTML = myDrugData.dataset.holding;
                    } else if (child.classList.contains("drugName")) {
                         child.innerHTML = drugData.dataset.name;
                    } else if (child.classList.contains("graph")) {
                         // TODO figure out histogram
                    } else if (child.classList.contains("price")) {
                         var basePrice = cityDrugData.dataset.price;
                         var dayPrice = basePrice;
                         if (vDay > 1) {
                              var minPrice = basePrice / 2;
                              var maxPrice = basePrice * 2;
                              var dayPrice = Math.random() * (maxPrice - minPrice) + minPrice;
                              dayPrice = Math.floor(dayPrice);
                         }

                         child.innerHTML = fmtMoney.format(dayPrice);
                         cityDrugData.dataset.dayprice = dayPrice;
                    }
               }

               if (
                    Number(drugData.dataset.dayprice) > Number(wallet.dataset.cash) &&
                    Number(myDrugData.dataset.holding) < 1
               ) {
                    drug.classList.add("disabled");
               } else {
                    drug.classList.remove("disabled");
               }
          }
     }
}

function refreshDealValues() {
     var purchaseInfo = document.getElementById("purchaseInfo");
     if (buying) {
          sellButton.parentNode.classList.remove("toggled");
          confirmDealButton.innerHTML = "Buy";
          purchaseInfo.style.visibility = "hidden"; // the thinking here is that you don't need purchase price to buy...thoughts?
     } else {
          sellButton.parentNode.classList.add("toggled");
          confirmDealButton.innerHTML = "Sell";
          purchaseInfo.style.visibility = "visible";
     }

     var cashTotal = vCash + vCashDelta;
     var holdingTotal = vHolding + vHoldingDelta;

     dealName.innerHTML = vName;
     dealPrice.innerHTML = fmtMoney.format(vCost);
     myPrice.innerHTML = fmtMoney.format(vAverage);
     dealCash.innerHTML = fmtMoney.format(cashTotal);
     capacity.innerHTML = holdingTotal + "/" + vCapacity;
     dealSliderCounter.innerHTML = vAmount;
     positionCounter(dealSlider, dealSliderCounter);

     cityDay.innerHTML = vDay;
}

function refreshBankValues() {
     if (depositing) {
          withdrawButton.parentNode.classList.remove("toggled");
          confirmBankButton.innerHTML = "Deposit";
     } else {
          withdrawButton.parentNode.classList.add("toggled");
          confirmBankButton.innerHTML = "Withdraw";
     }

     var cashTotal = vCash + vCashDelta;
     var bankTotal = vBank + vBankDelta;

     bankCash.innerHTML = fmtMoney.format(cashTotal);
     bankBank.innerHTML = fmtMoney.format(bankTotal);
     bankSliderCounter.innerHTML = vAmount;
     positionCounter(bankSlider, bankSliderCounter);
}

function refreshLoanValues() {
     if (paying) {
          borrowButton.parentNode.classList.remove("toggled");
          confirmLoanButton.innerHTML = "Pay";
     } else {
          borrowButton.parentNode.classList.add("toggled");
          confirmLoanButton.innerHTML = "Borrow";
     }

     var cashTotal = vCash + vCashDelta;
     var debtTotal = vDebt + vDebtDelta;

     loanCash.innerHTML = fmtMoney.format(cashTotal);
     loanDebt.innerHTML = fmtMoney.format(debtTotal);
     loanSliderCounter.innerHTML = vAmount;
     positionCounter(loanSlider, loanSliderCounter);
}

function refreshWallet() {
     cityCash.innerHTML = fmtMoney.format(wallet.dataset.cash);
     cityBank.innerHTML = fmtMoney.format(wallet.dataset.bank);
     cityDebt.innerHTML = fmtMoney.format(wallet.dataset.debt);
}

function refreshDay() {
     cityDay.innerHTML = vDay;
}

function showMessageBundle(message) {
     showMessage(message.title, message.body, message.button1, message.button2, message.callback1, message.callback2, message.art);
}

function showMessage(msgTitle, msgBody, msgButton1, msgButton2, callback1, callback2, artSignifier) {
     body.classList.add("showMessage");
     popup.classList.add(artSignifier);
     messageTitle.innerHTML = msgTitle;
     messageBody.innerHTML = msgBody;
     if (msgButton2 == null || msgButton2 == "") {
          messageActionsSolo.style.visibility = "visible";
          messageActionsSolo.style.removeProperty("height");
          messageActionsDouble.style.visibility = "hidden";
          messageActionsDouble.style.height = 0;
          messageButton.innerHTML = msgButton1;
     } else {
          messageActionsDouble.style.visibility = "visible";
          messageActionsDouble.style.removeProperty("height");
          messageActionsSolo.style.visibility = "hidden";
          messageActionsSolo.style.height = 0;
          messageButton1.innerHTML = msgButton1;
          messageButton2.innerHTML = msgButton2;
     }

     messageButton.onclick = function() {
          body.classList.remove("showMessage");
          if (callback1 != null) {
               callback1();
          }
     }

     messageButton1.onclick = function() {
          body.classList.remove("showMessage");
          if (callback1 != null) {
               callback1();
          }
     }

     messageButton2.onclick = function() {
          body.classList.remove("showMessage");
          if (callback2 != null) {
               callback2();
          }
     }
}

function secondaryButton(buttonText) {
     return '<a href="#" class="buttonSecondary button">' + buttonText + "</a>";
}

confirmDealButton.onclick = function () {
     var wallet = document.getElementById("wallet");
     wallet.dataset.cash = Number(wallet.dataset.cash) + Number(vCashDelta);

     var totalHolding = Number(dealDrugData.dataset.holding);
     var avg = totalHolding * vAverage;
     avg += vCost * vHoldingDelta;
     totalHolding += vHoldingDelta;
     if (totalHolding <= 0) {
          avg = 0;
     } else {
          avg /= totalHolding;
     }
     dealDrugData.dataset.holding = totalHolding;
     dealDrugData.dataset.price = Math.trunc(avg);

     refreshWallet();
     refreshDrugs();
     body.classList.remove("showDeal");
};

function cancelTransaction() {
     clearBodyClasses();
     vCashDelta = 0;
     vBankDelta = 0;
     vDebtDelta = 0;
     vHoldingDelta = 0;
}

cancelDealButton.onclick = cancelTransaction;
cancelBankButton.onclick = cancelTransaction;
cancelLoanButton.onclick = cancelTransaction;
darkness.onclick = cancelTransaction;

buyButton.onclick = function () {
     buying = true;
     vAmount = 0;
     vCashDelta = 0;
     vHoldingDelta = 0;
     dealSlider.max = vCapacity - vHolding;
     dealSlider.value = 0;
     refreshDealValues();
};

sellButton.onclick = function () {
     buying = false;
     vAmount = 0;
     vCashDelta = 0;
     vHoldingDelta = 0;
     dealSlider.max = vHolding;
     dealSlider.value = 0;
     refreshDealValues();
};

dealSlider.oninput = function () {
     var totalHolding = vHolding + vHoldingDelta;
     var totalCash = vCash + vCashDelta;
     var direction = dealDirection();

     while (vAmount < Number(dealSlider.value)) {
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

     while (vAmount > Number(dealSlider.value)) {
          vAmount -= 1;
          vHoldingDelta -= 1 * direction;
          vCashDelta += vCost * direction;
     }

     dealSlider.value = vAmount;
     refreshDealValues();
};

specialButton.onclick = function () {
     if (specialButton.dataset.host == "bank") {
          clearBodyClasses();
          body.classList.add("showBank");
          vCash = Number(wallet.dataset.cash);
          vBank = Number(wallet.dataset.bank);
          depositButton.onclick();
     } else if (specialButton.dataset.host == "loan") {
          clearBodyClasses();
          body.classList.add("showLoanShark");
          vCash = Number(wallet.dataset.cash);
          vDebt = Number(wallet.dataset.debt);
          payButton.onclick();
     }
};

depositButton.onclick = function () {
     depositing = true;
     vAmount = 0;
     vCashDelta = 0;
     vBankDelta = 0;
     bankSlider.max = vCash;
     bankSlider.value = 0;
     refreshBankValues();
};

withdrawButton.onclick = function () {
     depositing = false;
     vAmount = 0;
     vCashDelta = 0;
     vBankDelta = 0;
     bankSlider.max = vBank;
     bankSlider.value = 0;
     refreshBankValues();
};

bankSlider.oninput = function () {
     var totalBank = vBank + vBankDelta;
     var totalCash = vCash + vCashDelta;
     var direction = bankDirection();

     while (vAmount < Number(bankSlider.value)) {
          vAmount += 1;
          vBankDelta += 1 * direction;
          vCashDelta -= 1 * direction;
     }

     while (vAmount > Number(bankSlider.value)) {
          vAmount -= 1;
          vBankDelta -= 1 * direction;
          vCashDelta += 1 * direction;
     }

     bankSlider.value = vAmount;
     refreshBankValues();
};

confirmBankButton.onclick = function () {
     var wallet = document.getElementById("wallet");
     wallet.dataset.cash = Number(wallet.dataset.cash) + Number(vCashDelta);
     wallet.dataset.bank = Number(wallet.dataset.bank) + Number(vBankDelta);
     vCashDelta = 0;
     vBankDelta = 0;

     refreshWallet();
     body.classList.remove("showBank");
};

payButton.onclick = function () {
     paying = true;
     vAmount = 0;
     vCashDelta = 0;
     vLoanDelta = 0;
     loanSlider.max = vCash;
     if (vDebt < vCash) {
          loanSlider.max = vDebt;
     }
     loanSlider.value = 0;
     refreshLoanValues();
};

borrowButton.onclick = function () {
     paying = false;
     vAmount = 0;
     vCashDelta = 0;
     vLoanDelta = 0;
     loanSlider.max = 15000 - vDebt;
     loanSlider.value = 0;
     refreshLoanValues();
};

loanSlider.oninput = function () {
     var totalDebt = vDebt + vDebtDelta;
     var totalCash = vCash + vCashDelta;
     var direction = loanDirection();

     while (vAmount < Number(loanSlider.value)) {
          vAmount += 1;
          vDebtDelta -= 1 * direction;
          vCashDelta -= 1 * direction;
     }

     while (vAmount > Number(loanSlider.value)) {
          vAmount -= 1;
          vDebtDelta += 1 * direction;
          vCashDelta += 1 * direction;
     }

     loanSlider.value = vAmount;
     refreshLoanValues();
};

confirmLoanButton.onclick = function () {
     var wallet = document.getElementById("wallet");
     wallet.dataset.cash = Number(wallet.dataset.cash) + Number(vCashDelta);
     wallet.dataset.debt = Number(wallet.dataset.debt) + Number(vDebtDelta);
     vCashDelta = 0;
     vDebtDelta = 0;

     refreshWallet();
     body.classList.remove("showLoanShark");
};

travelButton.onclick = function () {
     body.classList.add("showTravel");
};

travCancelButton.onclick = function () {
     body.classList.remove("showTravel");
};

function clearBodyClasses() {
     body.classList.remove("showDeal");
     body.classList.remove("showTravel");
     body.classList.remove("showBank");
     body.classList.remove("showLoanShark");
     body.classList.remove("showMessage");
}

refreshDealValues();
refreshBankValues();
refreshLoanValues();

// @Ben uncomment to see placeholder event
//showMessage("event title", "<p>and body</p><p>with more</p>", "affirmative", "");

// @Sam...I'm sure we'll end up putting all this content into objects or something..I just wanted to see these popups with their artowrk

//function showMessage(msgTitle, msgBody, msgButton1, msgButton2, artSignifier) {
msgWelcome = {
     title:   "it's late May 1, 1987",
     body:    `<p>You’ve flunked out of college, you’re broke, and running out of options. Out of desperation, you decide to try your hand at the drug game.</p>
     <p>Against your girlfriend's advice, you hit up notorious loan shark “Big Rick”. He loan's you $5000, at 10% interest per day.</p>
     <p>The loan is due in 10 days.<br />Rent is due in 30 days.</p>`,
     button1: "Let's Go",
     button2: "",
     art:     "welcome"
};

msgJumped = {
     title:   "You Got Jumped!",
     body:    "<p>They made off with <span>$N cash</span> and <span>M units</span> of <span>drug</span>.</p>",
     button1: "Damn",
     button2: "",
     art:     "jumped"
};

msgShakedown = {
     title:   "Cops shake you down!",
     body:    "<p>They made off with <span>$N cash</span> and <span>M units</span> of <span>drug</span>.</p>",
     button1: "damn",
     button2: "",
     art:     "shakedown"
};

msgPackage = {
     title:   "You found a package!",
     body:    "<p>You found a package in a suitcase that looked like yours at the baggage claim.<br />+ <span>N units</span> of <span>drug</span></p>",
     button1: "Nice",
     button2: "",
     art:     "package"
};

msgStash = {
     title:   "You found a stash!",
     body:    "<p>A friend stashed his stuff at your place before getting busted.<br />+ <span>N units</span> of <span>drug</span></p>",
     button1: "Nice",
     button2: "",
     art:     "stash"
};

msgBuySetup = {
     title:   "It's a setup!",
     body:    "<p>The drugs are fake!</p>",
     button1: "Attack",
     button2: "Surrender",
     callback1: buySetupAttack,
     callback2: buySetupSurrender,
     art:     "buySetup"
};

function buySetupAttack()
{
     msgBuySetupAttack = {
          title:   "You start shooting...",
          body:    "<p>Through a hail of gunfire, you make your way to the fire escape and flee.</p>",
          button1: "Continue",
          button2: "",
          art:     "buySetupAttack"
     };

     var roll = Math.random();
     var fail = roll < buySetupChance.dataset.attackdeath;
     if (fail) {
          msgBuySetupAttack.callback = endDeath();
     }

     showMessageBundle(msgBuySetupAttack);
}

function buySetupSurrender()
{
     msgBuySetupSurrender = {
          title:   "This doesn't look good...",
          body:    "<p>You throw your hands up and try to bargain for your life. The dealer cleans you out and leaves you in a dumpster with a mild concussion.<br />- <span>N cash</span><br />- <span>N units</span> of <span>drug</span></p>",
          button1: "Continue",
          button2: "",
          art:     "buySetupSurrender"
     };

     showMessageBundle(msgBuySetupSurrender);
}

msgSellSetup = {
     title:   "It's a setup!",
     body:    "<p>The dude was wearing a wire. Two cops bust into the apartment!</p>",
     button1: "Flee",
     button2: "Surrender",
     callback1: sellSetupFlee,
     callback2: sellSetupSurrender,
     art:     "sellSetup"
};

function sellSetupFlee() {
     msgSellSetupFlee = {
          title:   "You make a break for it...",
          body:    "<p>Shots ring out as you crash through a second story window, onto a fire-escape...<br />- <span>N units</span> of <span>drug</span></p>",
          button1: "Continue",
          button2: "",
          art:     "sellSetupFlee"
     };

     var roll = Math.random();
     var fail = roll < sellSetupChance.dataset.fleedeath;
     if (fail) {
          msgSellSetupFlee.callback1 = endDeath();
     }

     showMessageBundle(msgSellSetupFlee);
}

function sellSetupSurrender() {
     msgSellSetupSurrender = {
          title:   "You're severely outgunned...",
          body:    "<p>You throw your hands up and say a quick prayer. Maybe the cops just want to rob you.<br />- <span>N cash</span><br />- <span>N units</span> of <span>drug</span></p>",
          button1: "Continue",
          button2: "",
          art:     "sellSetupSurrender"
     };

     var roll = Math.random();
     var fail = roll < sellSetupChance.dataset.surrenderjail;
     if (fail) {
          msgSellSetupSurrender.callback1 = endJail();
     }
     showMessageBundle(msgSellSetupSurrender);
}

msgLoanReminder = {
     title:   "Big Rick wants his money...",
     body:    "<p>This is a friendly reminder that you owe our associate <span>$N</span>.<br /><br />You got <span>N</span> days.</p>",
     button1: "Understood",
     button2: "",
     art:     "loanReminder"
};

msgLoanDeadline = {
     title:   "Times up pretty boy...",
     body:    "<p>Big Rick feels he's been more than patient with you. He sent us to make an example...</p>",
     button1: "Damn",
     button2: "",
     art:     "loanDeadline"
};

msgShamrock = {
     title:   "You found a four leaf clover!",
     body:    "<p>It's your lucky day.</p>",
     button1: "Nice",
     button2: "",
     art:     "shamrock"
};

function showSmallEvent() {
     var events = [msgJumped, msgShakedown, msgPackage, msgStash];
     var roll = Math.random();
     showMessageBundle(events[Math.floor(roll * events.length)]);
}

function showBigEvent() {
     var events = [msgBuySetup, msgSellSetup];
     var roll = Math.random();
     showMessageBundle(events[Math.floor(roll * events.length)]);
}

function endDeath() {
     // TODO Sam we ends will actually new slides instead of a pop-up
     // TODO @sam WHY does the message not appear? It doesn't even seem to be called. Should we use showMessageBundle?
     showMessage("End of the Line", "You died", "New Game", null, restart(), null, null);
}

function endJail() {
     // TODO Sam we ends will actually new slides instead of a pop-up
     showMessage("End of the Line", "You went to jail", "New Game", null, restart(), null, null);
}

function endBroke() {
     // TODO Sam we ends will actually new slides instead of a pop-up
     showMessage("End of the Line", "You went broke", "New Game", null, restart(), null, null);
}

function endRich() {
     // TODO Sam we ends will actually new slides instead of a pop-up
     showMessage("End of the Line", "You made that money!", "New Game", null, restart(), null, null);
}

function endRecruit() {
     // TODO Sam we ends will actually new slides instead of a pop-up
     showMessage("End of the Line", "You're pretty good at this", "...", null, restart(), null, null);
}

function restart() {
     // TODO Sam how do we want to reset the app?
     location.reload();
}

// Ben's transit code

let transitState = 0;

function transit(city) {
     // if there is a body class of "fisherWatching", then bg speed is "1s" else "2s"
     //const speed = body.classList.contains("fisherWatching") ? "1s" : "2s";
     const incrementAmount = body.classList.contains("fisherWatching") ? -270 : -100;

     const speed = "2s";

     const screen = document.getElementById("mainScreen");
     const screen2 = document.getElementById("transit");
     const screen3 = document.getElementById("landscape");
     var currentPos = window.getComputedStyle(screen3).getPropertyValue("background-position-x");
     var currentPosition = parseFloat(currentPos);
     currentPosition += incrementAmount;

     if (transitState === 0) {
          screen.style.transform = "translateX(-100%)";
          screen2.style.transition = "transform 1s linear";
          screen2.style.transform = "translateX(0%)";

          screen3.style.transition = "background-position-x 2s linear";
          screen3.style.backgroundPositionX = currentPosition + "px";

          transitState = 1;
          setTimeout(() => {
               screen.style.transition = "none"; // Disable transition for immediate jump
               screen.style.transform = "translateX(100%)"; // Move screen to the right side

               setTimeout(() => {
                    screen.style.transition = "transform 1s linear"; // Re-enable transition
                    screen.style.transform = "translateX(0)"; // Slide screen back to the center
                    screen2.style.transform = "translateX(-100%)"; // Slide screen back to the center
                    transitState = 0;

                    // Change city
                    if (city.dataset.to != vCity) {
                         enterCity(city.dataset.to);
                         refreshDrugs();
                    }
               }, 20);
          }, 1000); // This timeout should match the CSS transition duration


          body.classList.remove("showTravel");

          setTimeout(() => {
               screen2.style.transition = "none";
               screen2.style.transform = "translateX(100%)";

               screen3.style.transition = "none";
               screen3.style.backgroundPositionX = 0;

               // Show an event if there is one
               attemptEvent()
          }, 2002);

     }
}

// --- ENTER GAME --- //
enterCity("bos");
showMessageBundle(msgWelcome);
