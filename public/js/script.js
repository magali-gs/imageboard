
(function () {
    Vue.component("highlighted-image", {
        template: "#template",
        props: ["imageId"],
        data: function () {
            return {
                title: "",
                description: "",
                username: "",
                created_at: '',
                url: ''
            };
        },
        mounted: function () {
            console.log("props: ", this.imageId);
            var self = this;
            axios
                .get("/highlighted/" + this.imageId)
                .then(function ({ data }) {
                    self.title = data[0].title;
                    self.description = data[0].description;
                    self.username = data[0].username;
                    self.created_at = data[0].created_at;
                    self.url = data[0].url;
                    console.log(self.url);
                })
                .catch(function (error) {
                    console.log("error: ", error);
                });
        }, 
        methods: {
            closeModal: function() {
                console.log('closeModal click worked');
                this.$emit('close');
            }
        }
    });

    new Vue({
        el: "#main",
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            image: null,
            imageId: null,
            hasMore: true
        },
        mounted: function () {
            var self = this;
            axios
                .get("/images")
                .then(function (res) {
                    self.images = res.data;
                })
                .catch(function (error) {
                    console.log("error: ", error);
                });
        },
        methods: {
            handleFileChange: function (e) {
                //update the image property
                this.image = e.target.files[0];
            },
            handleUpload: function (e) {
                //prevent default behavior
                e.preventDefault();
                //POST data to the /uploads path with axios
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("image", this.image);

                axios.post("/upload", formData).then((res) => {
                    this.images.unshift(res.data);
                });
            },
            getImageId: function (img) {
                this.imageId = img.id;
                console.log("getImageId worked");
            },
            closeMe: function () {
                console.log("closeme in the instance");
                this.imageId = null;
            },
            moreImages: function () {
                var self = this;
                console.log("moreImages button worked");
                const lastId = this.images[this.images.length - 1].id;
                axios.get("/more/" + lastId)
                    .then(({ data }) => {
                        console.log(data);
                        data.forEach((element) => {
                            if(element.id == element.lowestId) {
                                self.hasMore = false;
                            }
                            self.images.push(element);
                        });
                    });
            },
        },
    });
})();