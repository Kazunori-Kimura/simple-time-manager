//view.js

//-- main view
var MainView = Backbone.View.extend({
    events: {
        "click .edit": "onEdit",
        "click .list": "onList"
    },
    /**
     * MainViewの初期化処理
     * @event MainView#initialize
     */
    initialize: function(){
        _.bindAll(this);

        //現在日付を保持する
        this.today = new Date();
        //描画処理を実行
        this.render();
    },
    /**
     * @event MainView#render
     */
    render: function(){
        $("#today").html(
            _.str.sprintf("%4d/%02d/%02d",
                this.today.getFullYear(),
                this.today.getMonth()+1,
                this.today.getDate())
        );
    },
    onEdit: function(){
        app.router.navigate("edit", {trigger: true});
    },
    onList: function(){
        app.router.navigate("list", {trigger: true});
    }
});

//-- list view
var ListView = Backbone.View.extend({
    events: {
        "click .back": "onBack"
    },
    initialize: function(){
        _.bindAll(this);

        //listのDOM
        this.$list = $("#month-list tbody");
        //描画処理
        this.render();
    },
    render: function(){
        var d = this.this_month;

        var day = d.getDate();
        while(d.getMonth() == this.this_month.getMonth()){
            this.addItemView(d);
            day++;
            d.setDate(day);
        }
    },
    addItemView: function(date){
        this.$list.append(new ItemView({ date: date }).render().el);
    },
    onBack: function(){
        app.router.navigate("", {trigger: true});
    }
});

//-- item view
var ItemView = Backbone.View.extend({
    tmpl: _.template($("#tmpl-itemview").html()),
    events: {
        "click .edit": "onEdit"
    },
    initialize: function(){
        _.bindAll(this);

    },
    render: function(){
        var d = _.str.sprintf("02d/02d",
            this.date.getMonth() + 1, this.date.getDate());
        this.$el.html(this.tmpl({ date: d }));
        return this;
    },
    onEdit: function(){
        var url = _.str.sprintf("edit/%d", this.date.getTime());
        app.router.navigate(url, {trigger: true});
    }
});

//-- edit view
var EditView = Backbone.View.extend({
    events: {
        "click .back": "onBack"
    },
    initialize: function(){
        _.bindAll(this);

        this.$date = $("#date");
    },
    render: function(){
        var d = _.str.sprintf("%4d/%02d/$02d",
            this.date.getFullYear(),
            this.date.getMonth() + 1,
            this.date.getDate());
        this.$date.html(d);
    },
    onBack: function(){
        app.router.navigate("", {trigger: true});
    }
});
