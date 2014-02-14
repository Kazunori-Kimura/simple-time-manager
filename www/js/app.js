//app.js
$(function(){

    //model
    var WorkDay = Backbone.Model.extend({
        defaults: function(){
            return {
                day: "",
                datetime: 0,
                start_dt: 0,
                end_dt: 0,
                start: "",
                end: "",
                rest: 0,
                worktime: 0
            };
        }
    });

    //collection
    var DayList = Backbone.Collection.extend({
        model: WorkDay,

        localStorage: new Backbone.LocalStorage("timemanager_data"),

        comparator: 'datetime'
    });

    //collection生成
    var Days = new DayList();



    //TodayView
    var TodayView = Backbone.View.extend({
        //template
        template: _.template($('#today-template').html()),

        //初期化処理
        initialize: function(){
            //modelに変更があった場合は再描画
            this.listenTo(this.model, "change", this.render);
        },

        //描画
        render: function(){
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }

    });


    //item view
    var ItemView = Backbone.View.extend({
        tagName: "li",
        className: "list-group-item",

        template: _.template($('#item-template').html()),

        events: {
            "click .item-edit": "showEdit"
        },

        //初期化処理
        initialize: function(){
            //modelに変更があった場合は再描画
            this.listenTo(this.model, "change", this.render);
        },

        //描画
        render: function(){
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        showEdit: function(){
            var $edit = $("#tm-edit");
            var view = new EditView({model: this.model});
            $edit.html(view.render().el);
        }
    });

    //edit view
    var EditView = Backbone.View.extend({
        tagName: "form",
        //className: "form-inline",

        template: _.template($('#edit-template').html()),

        events: {
            "click .btn-save": "update"
        },

        //初期化処理
        initialize: function(){
            //modelに変更があった場合は再描画
            this.listenTo(this.model, "change", this.render);
        },

        //描画
        render: function(){
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        update: function(){
            var st = $("#inputStart").val(),
                et = $("#inputEnd").val(),
                rt = $("#inputRest").val();

            console.log("update: start='%s', end='%s', rest='%s'", st, et, rt);

            this.model.save({
                start: st,
                end: et,
                rest: rt
            });
        }
    });

    //list view (mainとなるview)
    var ListView = Backbone.View.extend({
        el: $("#app"),

        //今日
        today: 0,
        //当月
        currentDate: 0,

        //ヘッダーtemplate
        headerTemplate: _.template($('#header-template').html()),

        //初期化処理
        initialize: function(){
            //collectionにeventをバインド
            this.listenTo(Days, 'all', this.render);

            //今日を取得
            var d = new Date();
            //trunc time
            this.today = new Date(d.getFullYear(), d.getMonth(), d.getDate());

            if(this.currentDate == 0){
                this.currentDate = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
            }

            //header
            this.$header = $("#tm-list-header");
            //list
            this.$list = $("#tm-list");
            //today
            this.$today = $("#today");
            //edit
            this.$edit = $("#tm-edit");

            Days.fetch();

            //SubView描画
            this.showToday();
            this.showEdit();
        },

        //描画
        render: function(){
            var cy = this.currentDate.getFullYear(),
                cm = this.currentDate.getMonth() + 1;

            //ヘッダー描画
            this.$header.html(this.headerTemplate({year: cy, month: _.string.sprintf("%02d", cm)}));

            //リスト描画
            this.addAll();

            return this;
        },

        //TodayView描画
        showToday: function(){
            var ds = Days.where({datetime: this.today.getTime()});
            var view = new TodayView({model: ds[0]});
            this.$today.html(view.render().el);
        },

        //EditView描画
        showEdit: function(day){
            var model = day;
            if(typeof day == "undefined"){
                var ds = Days.where({datetime: this.today.getTime()});
                model = ds[0];
            }
            
            var view = new EditView({model: model});
            this.$edit.html(view.render().el);
        },

        //1件描画
        addOne: function(day){
            var view = new ItemView({model: day});
            this.$list.append(view.render().el);
        },

        //1月分描画
        addAll: function(){
            var cd = new Date(this.currentDate.getTime()), //clone date.
                mon = this.currentDate.getMonth();

            this.$list.html(""); //Listをリセット
            while(cd.getMonth() === mon){
                //get model
                var ds = Days.where({datetime: cd.getTime()});

                if(ds.length > 0){
                    this.addOne(ds[0]);
                }else{
                    //model作成
                    var day = _.string.sprintf("%4d/%02d/%02d", cd.getFullYear(), cd.getMonth()+1, cd.getDate()),
                        d = new WorkDay({datetime: cd.getTime(), day: day});
                    //collectionに追加
                    Days.add(d, {silent: true});
                    this.addOne(d);
                }

                cd.setDate(cd.getDate()+1);
            } //end while
        }
    });

    var app = new ListView();
});
