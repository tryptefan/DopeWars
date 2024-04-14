const body = document.body;
const location_title = document.getElementById("locationTitle")
const cancel_button = document.getElementById("secondaryAction");
let darkness = document.getElementById("darkness");
const city_day = document.getElementById("cityDay");
const city_cash = document.getElementById("cityCash");
const city_bank = document.getElementById("cityBank");
const city_debt = document.getElementById("cityDebt");
const bs_cash = document.getElementById("bs_cash");
const capacity = document.getElementById("bs_capacity");
//const amount = document.getElementById("bs_amount");
const bs_name = document.getElementById("bs_name");
const bs_price = document.getElementById("bs_price");
const my_price = document.getElementById("my_price");
const buy_button = document.getElementById("buy_button");
const sell_button = document.getElementById("sell_button");
const bs_slider = document.getElementById("bs_slider");
const confirm_transaction_button = document.getElementById("primaryAction");
const cancel_transaction_button = document.getElementById("secondaryAction");
const sliderCounter = document.getElementById("sliderCounter");

const fmt_money = Intl.NumberFormat("en-US", {
     style: "currency",
     currency: "USD",
     minimumFractionDigits: "2",
});

var buying = true;
var v_drug_id = "";
var v_name = "";
var v_cost = 50;
var v_average = 0;
var v_cash = 1298;
var v_holding = 12;
var v_capacity = 100;
var v_cash_delta = 0;
var v_holding_delta = 0;
var v_amount = 0;
var v_day = 1;

var v_city = "";
enter_city("la");
function enter_city(city_id) {
     var city_data = document.getElementById("city_" + city_id);
     if (city_data != null && location_title != null) {
          v_city = city_id;
          location_title.innerHTML = city_data.dataset.name;
     }
}

var bs_drug_data = null;
var drugs = document.getElementsByClassName("drug");
refresh_drugs();
for (var i = 0; i < drugs.length; i++) {
     drugs[i].onclick = open_drug;
}

refresh_wallet();
refresh_day();

function open_drug() {
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

     console.log(drug.dataset.name);

     v_drug_id = drug.dataset.name;

     var drug_data = document.getElementById("ur_" + v_drug_id);
     if (drug_data == null) {
          return;
     }
     console.log(drug_data);

     var city_drug_data = document.getElementById(v_city + "_" + v_drug_id);
     if (city_drug_data == null) {
          return;
     }
     console.log(city_drug_data);

     bs_drug_data = document.getElementById("my" + "_" + v_drug_id);
     if (bs_drug_data == null) {
          return;
     }
     console.log(bs_drug_data);

     var wallet = document.getElementById("wallet");

     v_name = drug_data.dataset.name;
     v_cost = city_drug_data.dataset.price;
     v_cash = Number(wallet.dataset.cash);
     v_holding = Number(bs_drug_data.dataset.holding);
     v_average = Number(bs_drug_data.dataset.price);
     v_cash_delta = 0;
     v_holding_delta = 0;
     v_amount = 0;
     buying = true;
     body.classList.add("showDeal");
     bs_slider.max = v_capacity - v_holding;
     bs_slider.value = 0;
     refresh_values();
}

function transaction_direction() {
     return buying ? 1 : -1;
}

function positionCounter() {
     // Get the current value and max value of the slider
     var currentValue = parseFloat(bs_slider.value);
     var maxValue = parseFloat(bs_slider.max);

     // Calculate the percentage
     var percentage = (currentValue / maxValue) * 100;
     percentage *= 0.94;
     if (maxValue < 1) {
          percentage = 0
     }

     // Set the left position of the next element
     sliderCounter.style.left = percentage + "%";
}

function refresh_drugs() {
     var wallet = document.getElementById("wallet")
     for (var i = 0; i < drugs.length; i++) {
          var drug = drugs[i]
          var drug_data = document.getElementById("ur_" + drug.dataset.name)
          var city_drug_data = document.getElementById(v_city + "_" + drug.dataset.name)
          var my_drug_data = document.getElementById("my_" + drug.dataset.name)
          if (drug_data != null && my_drug_data != null) {
               var children = drug.children
               for (var j = 0; j < children.length; j++) {
                    var child = children[j]
                    if (child.classList.contains("amount")) {
                         child.innerHTML = my_drug_data.dataset.holding;
                    } else if (child.classList.contains("drugName")) {
                         child.innerHTML = drug_data.dataset.name;
                    } else if (child.classList.contains("graph")) {
                         // TODO figure out histogram
                    } else if (child.classList.contains("price")) {
                         child.innerHTML = city_drug_data.dataset.price;
                    }
               }

               if (Number(drug_data.dataset.price) > Number(wallet.dataset.cash) && Number(my_drug_data.dataset.holding) < 1) {
                    drug.classList.add("disabled")
               } else {
                    drug.classList.remove("disabled")
               }
          }
     }
}

function refresh_values() {
     if (buying) {
          sell_button.parentNode.classList.remove("toggled");
          confirm_transaction_button.innerHTML = "Buy";
     } else {
          sell_button.parentNode.classList.add("toggled");
          confirm_transaction_button.innerHTML = "Sell";
     }

     var cash_total = v_cash + v_cash_delta;
     var holding_total = v_holding + v_holding_delta;

     bs_name.innerHTML = v_name;
     bs_price.innerHTML = fmt_money.format(v_cost);
     my_price.innerHTML = fmt_money.format(v_average);
     bs_cash.innerHTML = fmt_money.format(cash_total);
     capacity.innerHTML = holding_total + "/" + v_capacity;
     sliderCounter.innerHTML = v_amount;
     positionCounter();
}

function refresh_wallet() {
     cityCash.innerHTML = fmt_money.format(wallet.dataset.cash);
     cityBank.innerHTML = fmt_money.format(wallet.dataset.bank);
     cityDebt.innerHTML = fmt_money.format(wallet.dataset.debt);
}

function refresh_day() {
     city_day.innerHTML = v_day;
}

confirm_transaction_button.onclick = function () {
     var wallet = document.getElementById("wallet");
     wallet.dataset.cash = Number(wallet.dataset.cash) + Number(v_cash_delta);

     var total_holding = Number(bs_drug_data.dataset.holding);
     var avg = total_holding * v_average;
     avg += v_cost * v_holding_delta;
     total_holding += v_holding_delta;
     if (total_holding <= 0) {
          avg = 0;
     } else {
          avg /= total_holding;
     }
     bs_drug_data.dataset.holding = total_holding;
     bs_drug_data.dataset.price = avg;

     refresh_wallet()
     refresh_drugs()
     body.classList.remove("showDeal");
};

function cancel_transaction() {
     body.classList.remove("showDeal");
     v_cash_delta = 0;
     v_holding_delta = 0;
}

cancel_transaction_button.onclick = cancel_transaction;
darkness.onclick = cancel_transaction;

buy_button.onclick = function () {
     buying = true;
     v_amount = 0;
     v_cash_delta = 0;
     v_holding_delta = 0;
     bs_slider.max = v_capacity - v_holding;
     bs_slider.value = 0;
     refresh_values();
};

sell_button.onclick = function () {
     buying = false;
     v_amount = 0;
     v_cash_delta = 0;
     v_holding_delta = 0;
     bs_slider.max = v_holding;
     bs_slider.value = 0;
     refresh_values();
};

bs_slider.oninput = function () {
     var total_holding = v_holding + v_holding_delta;
     var total_cash = v_cash + v_cash_delta;
     var direction = transaction_direction();

     while (v_amount < Number(bs_slider.value)) {
          var can_inc = false;
          if (buying && v_cash + v_cash_delta >= v_cost && v_holding + v_holding_delta <= v_capacity) {
               can_inc = true;
          } else if (!buying && v_holding + v_holding_delta > 0) {
               can_inc = true;
          }

          if (can_inc) {
               v_amount += 1;
               v_holding_delta += 1 * direction;
               v_cash_delta -= v_cost * direction;
          } else {
               break;
          }
     }

     while (v_amount > Number(bs_slider.value)) {
          v_amount -= 1;
          v_holding_delta -= 1 * direction;
          v_cash_delta += v_cost * direction;
     }

     bs_slider.value = v_amount;
     refresh_values();
};

refresh_values();
