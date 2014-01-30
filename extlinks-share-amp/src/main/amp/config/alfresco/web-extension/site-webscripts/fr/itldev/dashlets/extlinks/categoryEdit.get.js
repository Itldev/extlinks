model.category = "";

try {
    var category = url.templateArgs["category"];
    if (category !== undefined) {
        model.category = category;
    }
} catch (e) {

}