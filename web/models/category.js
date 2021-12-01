module.exports = function(sequelize, DataTypes){
    let category = sequelize.define("category", {
        categoryNo: { // pk
            field: "categoryNo",
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        categoryName: {
            field: "categoryName",
            type: DataTypes.STRING(10),
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
        tableName: "category"
    });
    // fk 지정
    category.associate = models => {
        category.belongsTo(models.store, {foreignKey: "storeNo", sourceKey: "storeNo"});
        category.hasMany(models.menu, {foreignKey: "categoryNo", sourceKey: "categoryNo"});
    };

    return category;
}