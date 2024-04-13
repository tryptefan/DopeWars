const cost = document.getElementById("cost");
const cash = document.getElementById("cash");
const capacity = document.getElementById("capacity");
const amount = document.getElementById("amount");
const buy_button = document.getElementById("buy_button")
const sell_button = document.getElementById("sell_button")
const inc_button = document.getElementById("inc_button");
const dec_button = document.getElementById("dec_button");

const fmt_money = Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	minimumFractionDigits: "2"
})

var buying = true;
var v_cost = 50;
var v_cash = 1298;
var v_holding = 12;
var v_capacity = 100;
var v_cash_delta = 0;
var v_holding_delta = 0;
var v_amount = 0

function transaction_direction() {
	return buying ? 1 : -1
}

function refresh_values() {
	if (buying) {
		buy_button.innerHTML = "(BUY)"
		sell_button.innerHTML = "(sell)"
	} else {
		buy_button.innerHTML = "(buy)"
		sell_button.innerHTML = "(SELL)"
	}

	cost.innerHTML = fmt_money.format(v_cost);
	cash.innerHTML = fmt_money.format(v_cash + v_cash_delta);
	capacity.innerHTML = (v_holding + v_holding_delta) + " / " + v_capacity;
	amount.innerHTML = v_amount;
}

buy_button.onclick = function() {
	buying = true;
	v_amount = 0;
	v_cash_delta = 0;
	v_holding_delta = 0;
	refresh_values();
}

sell_button.onclick = function() {
	buying = false;
	v_amount = 0;
	v_cash_delta = 0;
	v_holding_delta = 0;
	refresh_values();
}

inc_button.onclick = function() {
	var total_holding = v_holding + v_holding_delta;
	var total_cash = v_cash + v_cash_delta;
	var can_inc = false;
	var direction = transaction_direction()
	if (buying && v_cash + v_cash_delta > v_cost && v_holding + v_holding_delta < v_capacity) {
		can_inc = true;
	} else if (!buying && v_holding + v_holding_delta > 0) {
		can_inc = true;
	}

	if (can_inc) {
		v_amount += 1
		v_holding_delta += 1 * direction;
		v_cash_delta -= v_cost * direction;
	}
	refresh_values();
}

dec_button.onclick = function() {
	var direction = transaction_direction()
	if (v_amount > 0) {
		v_amount -= 1
		v_holding_delta -= 1 * direction;
		v_cash_delta += v_cost * direction;
	}
	refresh_values();
}

refresh_values();
