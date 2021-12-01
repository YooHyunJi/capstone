module.exports = function(sequelize, DataTypes){
    let store = sequelize.define("store", {
        storeNo: { // pk
            field: "storeNo",
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        storeId: {
            field: "storeId",
            type: DataTypes.STRING(30),
            allowNull: false
        },
        storeName: {
            field: "storeName",
            type: DataTypes.STRING(50),
            allowNull: false
        },
        storePw: {
            field: "storePw",
            type: DataTypes.STRING(500),
            allowNull: false
        },
        salt: {
            field: "salt",
            type: DataTypes.STRING(255),
            allowNull: false
        },
        storeTel: {
            field: "storeTel",
            type: DataTypes.STRING(15),
            allowNull: false
        },
        storeLoc: {
            field: "storeLoc",
            type: DataTypes.STRING(100),
            allowNull: false
        },
        crn: {
            field: "crn",
            type: DataTypes.STRING(100),
            allowNull: false
        },
        managerName: {
            field: "managerName",
            type: DataTypes.STRING(10),
            allowNull: false
        },
        managerTel: {
            field: "managerTel",
            type: DataTypes.STRING(15),
            allowNull: false
        },
        regDate: {
            field: "regDate",
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        underscored: true,
        freezeTableName: true,
        timestamps: false,
        tableName: "store"
    });
    // fk 지정
    store.associate = models => {
        store.hasMany(models.category, {foreignKey: "storeNo", sourceKey: "storeNo"});
        store.hasMany(models.menu, {foreignKey: "storeNo", sourceKey: "storeNo"});
        store.hasMany(models.orders, {foreignKey: "storeNo", sourceKey: "storeNo"});
        store.hasMany(models.orderDetail, {foreignKey: "storeNo", sourceKey: "storeNo"});
        store.hasMany(models.payment, {foreignKey: "storeNo", sourceKey: "storeNo"});
    };

    return store;
}