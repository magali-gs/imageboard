new Vue({
    el: "#main",
    data: {
        images: [],
        title: "",
        img: null
    },
    methods: { 
        handleFileChange: function(e) {
            console.log("e.target.files", e.target.files);
            //update the image property
            this.image = e.target.files[0];
        },
        handleUpload: function(e) {
            //prevent default behavior
            e.preventDefault();
            //POST data to the /uploads path with axios
            var formData = new FormData();

            formData.append("title", this.title);
            formData.append("image", this.image);

            axios.post("/upload", formData).then((res) => {
                console.log("formData res", res);
            });
        }

    },
    mounted: function () {
        var self = this;
        axios
            .get("/images")
            .then(function (response) {
                self.images = response.data;
            })
            .catch(function (error) {
                console.log("error: ", error);
            });
    }
});