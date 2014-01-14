//model.js

/**
 * @type {Backbone.Model}
 */
var Day = Backbone.Model.extend({
    defaults: {
        start: 0,       //出勤時間{Date}
        end: 0,         //退勤時間{Date}
        rest: 0,        //休憩時間{Number}
        comment: ""     //コメント{String}
    },
    initialize: function(){
        console.log("TimeData [%s]", this.cid);
    }
});


var Days = Backbone.Collection.extend({
    model: Day,
    /**
     * 比較用関数
     * @param {Day}
     */
    comparator: function(item){
        //出勤時間順にソートする
        return item.get("start");
    }
});
