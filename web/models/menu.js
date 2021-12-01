module.exports = function(sequelize, DataTypes){
    let menu = sequelize.define("menu", {
        menuNo: { // pk
            field: "menuNo",
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        menuName: {
            field: "menuName",
            type: DataTypes.STRING(30),
            allowNull: false
        },
        menuDetail: {
            field: "menuDetail",
            type: DataTypes.STRING(500),
            allowNull: false
        },
        menuPrice: {
            field: "menuPrice",
            type: DataTypes.INTEGER,
            allowNull: false
        },
        menuImg: {
            field: "menuImg",
            type: DataTypes.STRING(100),
            allowNull: false
        },
        categoryNo: { // fk
            field: "categoryNo",
            type: DataTypes.INTEGER,
            allowNull: false
        },
        storeNo: { // fk
            field: "storeNo",
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        underscored: true,
        freezeTableName: true,
        timestamps: false,
        tableName: "menu"
    });
    // fk 지정
    menu.associate = models => {
        menu.belongsTo(models.store, {foreignKey: "storeNo", sourceKey: "storeNo"});
        menu.belongsTo(models.category, {foreignKey: "categoryNo", sourceKey: "categoryNo"});
        menu.hasMany(models.orderDetail, {foreignKey: "menuNo", sourceKey: "menuNo"});
    };

    return menu;
}