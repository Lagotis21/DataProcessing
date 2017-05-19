function lambda() {
     d3.queue()
        .defer(function worldmap() {
            d3.json("data/world-topo-min.json" function(error, world){
                console.log()
            })
        .defer(function drawbarchart() {
             d3.csv("data/worlddata.csv" function (error, data) {
                 console.log(data[0])
             });
             console.log(data)
         })
         .await(ready)

    function ready(error){
        console.log("bob")//error ? "error: " + error.responseText)
    }
}
