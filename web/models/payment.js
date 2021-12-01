module.exports = function(sequelize, DataTypes){
    let payment = sequelize.define("payment", {
        paymentNo: { // pk
            field: "paymentNo",
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        paymentType: {
            field: "paymentType",
            type: DataTypes.STRING(50),
            allowNull: false
        },
        paymentTime: {
            field: "paymentTime",
            type: DataTypes.DATE,
            allowNull: false
        },
        paymentMethod: {
            field: "paymentMethod",
            type: DataTypes.STRING(50),
            allowNull: false
        },
        paymentPrice: {
            field: "paymentPrice",
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
        }
    }, {
        underscored: true,
        freezeTableName: true,
        timestamps: false,
        tableName: "payment"
    });
    // fk 지정
    payment.associate = models => {
        payment.belongsTo(models.store, {foreignKey: "storeNo", sourceKey: "storeNo"});
        payment.belongsTo(models.orders, {foreignKey: "orderNo", sourceKey: "orderNo"});
    };

    return payment;
}