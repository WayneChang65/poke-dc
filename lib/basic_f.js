'use strict';
const dateTime = require('node-datetime');

/**
 * [輸入mili second，傳回時分秒陣列]
 * @param       {[number]} _miliSec [int微秒]
 * @return      {[array]}           [時、分、秒，int 陣列]
 */
function _transMiliSecToHMS(_miliSec) {
	let hms = [];
	let h = parseInt(_miliSec / (1000 * 60 * 60));
	_miliSec -= h * (1000 * 60 * 60);
	let m = parseInt(_miliSec / (1000 * 60));
	_miliSec -= m * (1000 * 60);
	let s = parseInt(_miliSec / 1000);
	if (h >= 24) h %= 24;
	hms.push(h);
	hms.push(m);
	hms.push(s);
	return hms;
}

// 取得現在時間
function _getCurrentDateTime(_shiftInDays) {
	// 本程式開始執行的時間
	let _dateTime;
	let gDt = dateTime.create();
	if (_isDST()) {
		gDt.offsetInHours(7);
	} else {
		gDt.offsetInHours(8);
	}
	dateTime.setShortWeekNames([
		'日', '一', '二', '三', '四', '五', '六'
	]);
	// 因為如果設定早上8點以前發訊，必須shift一天，日期才會對。時區問題。
	if (_shiftInDays) gDt.offsetInDays(_shiftInDays);
	_dateTime = gDt.format('Y/m/d (w) H:M:S');
	return _dateTime;
}

// 檢查是否為 夏季節約時間 (因為系統用英國時間，所以會用到)
function _isDST() {
	Date.prototype.stdTimezoneOffset = function () {
		let jan = new Date(this.getFullYear(), 0, 1);
		let jul = new Date(this.getFullYear(), 6, 1);
		return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
	};
	Date.prototype.dst = function () {
		return this.getTimezoneOffset() < this.stdTimezoneOffset();
	};
	let today = new Date();
	return today.dst();
}

//////////////  Module Exports //////////////////
module.exports = {
	transMiliSecToHMS: _transMiliSecToHMS,
	getCurrentDateTime: _getCurrentDateTime,
	isDST: _isDST
};
