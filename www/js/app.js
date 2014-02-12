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
                rest: 0
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


    //item view
    var ItemView = Backbone.View.extend({
        tagName : "li",

        template: _.template($('#item-template').html()),

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

    //list view
    var ListView = Backbone.View.extend({
        el: $("#app"),

        //今日
        today: new Date(),
        //当月
        currentDate: 0,

        //ヘッダーtemplate
        headerTemplate: _.template($('#header-template').html()),

        //初期化処理
        initialize: function(){
            //collectionにeventをバインド
            this.listenTo(Days, 'add', this.addOne);
            this.listenTo(Days, 'reset', this.addAll);
            this.listenTo(Days, 'all', this.render);

            if(this.currentDate == 0){
                this.currentDate = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
            }

            //header
            this.$header = $(".page-header");
            //list
            this.$list = $("#tm-list");

            Days.fetch();
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

        //1件描画
        addOne: function(day){
            var view = new ItemView({model: day});
            this.$list.append(view.render().el);
        },

        //1月分描画
        addAll: function(){
            var cd = new Date(this.currentDate.getTime()), //clone date.
                mon = this.currentDate.getMonth();

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

    var _d = new Date();
    var app = new AppView({currentDate: new Date(_d.getFullYear(), _d.getMonth(), 1)});

});
