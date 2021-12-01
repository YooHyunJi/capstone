module.exports = function(sequelize, DataTypes){
    let orders = sequelize.define("orders", {
        orderNo: { // pk
            field: "orderNo",
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        orderTime: {
            field: "orderTime",
            type: DataTypes.DATE,
            allowNull: false
        },
        orderStatus: {
            field: "orderStatus",
            type: DataTypes.INTEGER,
            default: 0,
            allowNull: false
        },
        customerTel: {
            field: "customerTel",
            type: DataTypes.STRING(14),
            allowNull: false
        },
        totalPrice: {
            field: "totalPrice",
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cancelYn: {
            field: "cancelYn",
            type: DataTypes.STRING(1),
            default: 'N',
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
        tableName: "orders"
    });
    // fk 지정
    orders.associate = models => {
        orders.belongsTo(models.store, {foreignKey: "storeNo", sourceKey: "storeNo"});
        orders.hasMany(models.orderDetail, {foreignKey: "orderNo", sourceKey: "orderNo"});
        orders.hasOne(models.payment, {foreignKey: "orderNo", sourceKey: "orderNo"});
    };

    return orders;
}