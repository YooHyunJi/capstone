module.exports = function(sequelize, DataTypes){
    let orderDetail = sequelize.define("orderDetail", {
        orderDetailNo: { // pk
            field: "orderDetailNo",
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        count: {
            field: "count",
            type: DataTypes.INTEGER,
            allowNull: false
        },
        orderDetailPrice: {
            field: "orderDetailPrice",
            type: DataTypes.INTEGER,
            allowNull: false
        },
        storeNo: { // fk
            field: "storeNo",
            type: DataTypes.INTEGER,
            allowNull: false
        },
        orderNo: { // fk
            field: "orderNo",
            type: DataTypes.INTEGER,
            allowNull: false
        },
        menuNo: { // fk
            field: "menuNo",
            type: DataTypes.INTEGER,
            allowNull: false
        },
        menuName: {
            field: "menuName",
            type: DataTypes.STRING(30),
            allowNull: false
        }
    }, {
        underscored: true,
        freezeTableName: true,
        timestamps: false,
        tableName: "orderDetail"
    });
    // fk 지정
    orderDetail.associate = models => {
        orderDetail.belongsTo(models.store, {foreignKey: "storeNo", sourceKey: "storeNo"});
        orderDetail.belongsTo(models.orders, {foreignKey: "orderNo", sourceKey: "orderNo"});
        orderDetail.belongsTo(models.menu, {foreignKey: "menuNo", sourceKey: "menuNo"});
    };

    return orderDetail;
}