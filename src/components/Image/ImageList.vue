<template>
  <div id="graphics">
    <center>
      <h2>Lista plików graficznych</h2>
    </center>

    <div>
      <center>
        <div class="tablist">
          <b-card no-body class="mb-1">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-button
                block
                href="#"
                v-b-toggle.accordion-1
                variant="dark info"
                class="filterButton"
              >
                <i class="far fa-caret-square-down fa-2x"></i>
                <span>Wyszukiwarka</span>
              </b-button>
            </b-card-header>
            <b-collapse id="accordion-1" hide accordion="accordion-body collapse" role="tabpanel">
              <b-card-body>
                <form class="form-inline col-md-12 table-responsive">
                  <input
                    type="text"
                    class="form-control mb-3 mr-sm-3 col-12 col-sm-12 col-sx-12 col-md-2"
                    id="collection"
                    placeholder="Kolekcja..."
                    v-model="params.collection"
                  />
                  <date-picker v-model="params.dateFrom" :placeholder="`Data od...`"></date-picker>
                  <date-picker v-model="params.dateTo" :placeholder="`Data do...`"></date-picker>
                  <input
                    type="text"
                    class="form-control mb-3 mr-sm-3 col-12 col-sm-12 col-sx-12 col-md-2"
                    id="keyword"
                    placeholder="Słowa kluczowe..."
                    v-model="params.keyword"
                  />
                  <input
                    type="number"
                    class="form-control mb-3 mr-sm-3 col-12 col-sm-12 col-sx-12 col-md-2"
                    id="maxWidth"
                    placeholder="Max szerokość w px..."
                    v-model="params.maxWidth"
                  />
                  <input
                    type="number"
                    class="form-control mb-3 mr-sm-3 col-12 col-sm-12 col-sx-12 col-md-2"
                    id="minWidth"
                    placeholder="Min szerokość w px..."
                    v-model="params.minWidth"
                  />
                  <input
                    type="number"
                    class="form-control mb-3 mr-sm-3 col-12 col-sm-12 col-sx-12 col-md-2"
                    id="maxHeight"
                    placeholder="Max wysokość w px..."
                    v-model="params.maxHeight"
                  />
                  <input
                    type="number"
                    class="form-control mb-3 mr-sm-3 col-12 col-sm-12 col-sx-12 col-md-2"
                    id="minHeight"
                    placeholder="Min wysokość w px..."
                    v-model="params.minHeight"
                  />
                  <b-button
                    class="form-control mb-3 mr-sm-3 col-12 col-sm-12 col-sx-12 col-md-2"
                    type="button"
                    @click="filterImage()"
                  >Wyszukaj</b-button>
                  <b-button
                    class="form-control mb-3 mr-sm-3 col-12 col-sm-12 col-sx-12 col-md-2"
                    @click="clear()"
                    type="button"
                  >Resetuj</b-button>
                  <b-button
                    class="form-control mb-3 mr-sm-3 col-12 col-sm-12 col-sx-12 col-md-2"
                    @click="reload()"
                    type="button"
                  >Przeładuj</b-button>
                </form>
              </b-card-body>
            </b-collapse>
          </b-card>
        </div>
      </center>
    </div>

    <div></div>
    <div
      class="image-list"
    >
  <ImageGallery v-if="showGallery" :images="imageList" :index="currentIndex" />
      <div class="flex-container col-md-12 justify-content-center" v-if="listLoaded">
        <template>
          <div
            v-for="(image, index) in imageList.slice(0, imageLimit)"
            class="image-box"
            :key="index"
          >
            <img
              :src="streamImage(image.thumbnail_path, '/image-thumbnail')"
              @click="openGallery(index)"
              :key="image.thumbnail_path"
            />
            <div class="image-menu" v-if="showMenu[index]" :key="index">
              <b-button v-if="type" variant="blue darken-4" @click="editImage(index)">Edytuj dane</b-button>
              <br />
              <b-button
                v-if="type"
                variant="red darken-4"
                @click="deleteImage(index, image.slug)"
              >Usuń</b-button>
              <br />
              <b-button variant="green darken-4" @click="previewImage(index)">Podgląd</b-button>
            </div>
            <i
              class="fas fa-cog fa-2x"
              id="imageConfig"
              @click="showImageOptions(index)"
              v-if="!showMenu[index]"
            ></i>
            <i
              class="fas fa-window-close fa-2x"
              id="imageConfigClose"
              @click="showImageOptions(index)"
              v-else
            ></i>
          </div>
        </template>

        <b-button @click="loadMore" v-if="imageLimit < imageList.length">Więcej</b-button>
      </div>
      <ImageDetail :image="this.image" />
      <ImageInfo v-if="infoVisibility" />
    </div>
    <router-link to="/admin/image/add" v-if="type">
      <i id="addImage" class="fas fa-plus fa-3x"></i>
    </router-link>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { address } from "../../store/api";
import DatePicker from "vue2-datepicker";
import { filterImageList } from "../../plugins/filterList";
import "vue2-datepicker/index.css";
import ImageInfo from "./ImageInfo";
import ImageDetail from "./Image";
import ImageGallery from "./ImageGallery"
export default {
  name: "ImageList",
  components: {
    DatePicker,
    ImageInfo,
    ImageDetail,
    ImageGallery
  },
  data() {
    return {
      imageLimit: 25,
      currentSrc: "",
      currentIndex: 0,
      imageList: [],
      listLoaded: false,
      targetImage: {},
      params: {
        dateFrom: "",
        dateTo: "",
        keyword: "",
        collection: "",
        width: "",
        height: ""
      },

      showMenu: []
    };
  },
  methods: {
    ...mapActions("image", [
      "imageToEdit",
      "allImages",
      "deleteImage",
      "imagePreview",
      "imageToEdit",
      "changeShowGallery",
    ]),

    reload: function() {
      this.$router.go();
    },
    openGallery: function(index) {
      this.currentIndex = index;
      this.changeShowGallery(true);
    },
    showImageOptions: function(i) {
      this.$forceUpdate();
      this.showMenu[i] = !this.showMenu[i];
    },

    loadMore: function() {
      let length = this.imageList.length;
      if (this.imageLimit >= length) this.imageLimit = length;
      else this.imageLimit += 25;
    },
    streamImage: function(path, thmb = "") {
      if (typeof path !== "undefined") {
        let parts = path.split("/");
        let slug = parts[parts.length - 1];
        return address + "/api/v1/image/stream" + thmb + "/" + slug;
      } else return "";
    },
    editImage: function(i) {
      this.imageToEdit(this.imageList[i]);
      this.$router.push("/admin/image/edit/" + this.imageList[i].slug);
    },
    previewImage: function(i) {
      this.imagePreview(this.imageList[i]);
      this.$bvModal.show("ImageDetail");
    },
    deleteImage: function(index, slug) {
      this.$dialog.confirm("Czy na pewno chcesz usunąć ten plik?").then(() => {
        this.$store
          .dispatch("image/deleteImage", this.imageList[index])
          .then(() => {
          //  //console.log(result);
          })
          .catch(() => {
         //   //console.log(error);
          });
        this.imageList = this.imageList.filter(x => x.slug != slug);
        this.showMenu[index] = false;
      });
    },
    filterImage: function() {
    //  //console.log("2", this.params);
      let filteredImage = filterImageList(this.images, this.params);
      this.imageLimit = 25;
      this.imageList = filteredImage;
    },
    clear: function() {
      this.params = {
        dateFrom: "",
        dateTo: "",
        keyword: "",
        collection: "",
        widthMin: "",
        widthMax: "",
        heightMin: "",
        heightMax: ""
      };
      this.filterImage();
    },
  },
  computed: {
    ...mapGetters("image", ["images", "infoVisibility", "image", "showGallery"]),
    ...mapGetters("user", ["age", "type"])
  },
  created() {
    this.$forceUpdate();
    this.allImages(this.age).then(result => {
      this.imageList = result.data.response;
      for (let i = 0; i < this.imageList.length; ++i) {
        this.showMenu[i] = false;
      }
      this.listLoaded = true;
    });
  }
};
</script>

<style scoped>
#addImage {
  position: fixed;
  bottom: 15px;
  right: 15px;
  color: rgba(24, 150, 41, 0.979);
}
#addImage:hover {
  color: rgba(37, 228, 63, 0.979);
  transition: 0.5s ease-out;
}
.image-list {
  position: realtive;
  outline: none !important;
  border: 0px;
  padding-bottom: 2em;
}
::-webkit-scrollbar {
  display: none;
}
.image-box {
  width: 320px;
  height: 200px;
  overflow: hidden;
  transition: 0.1s ease;
}

.image-box:hover {
  outline: none;
  box-shadow: 0 0 25px rgba(30, 120, 255, 0.9);
}

.image-box img {
  width: 320px;
  height: 240px;
  -moz-transition: all 0.3s;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
}

.flex-container {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  padding: 0;
}
.flex-container > div > img {
  margin: 0;
  transform-origin: 50% 50%;
  padding: 2px;
  transition: transform 0.5s ease;
}

.flex-container > div > img:hover {
  transform: scale(1.5);
  z-index: 100;
}



#imageConfig {
  z-index: 100;
  position: relative;
  left: 280px;
  top: -90px;
  color: rgba(255, 255, 255, 0.3);
}

#imageConfig:hover {
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
}

#imageConfigClose {
  z-index: 100;
  position: relative;
  left: 280px;
  top: -330px;
  color: rgba(255, 255, 255, 0.3);
}

#imageConfigClose:hover {
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
}

.image-menu {
  position: relative;
  width: 320px;
  height: 240px;
  top: -240px;
  background-color: rgba(0, 0, 0, 0.6);
}

.image-menu button {
  top: 25px;
  left: 15%;
  width: 200px;
  position: relative;
}

.rotate-image {
  left: 50%;
  transform: translate(-50%);
  bottom: 1em;
  position: absolute;
}

.mx-datepicker {
  width: 340px;
  padding-bottom: 15px;
  padding-right: 20px;
}

.filterButton {
  width: fit-content;
}

.filterButton span {
  position: relative;
  left: 5px;
  top: -5px;
}

.mb-1 {
  border: none;
  box-shadow: none;
  -webkit-box-shadow: none;
}

.mb-1 header {
  background-color: rgba(255, 255, 255);
  border: 0px;
  text-shadow: none;
  text-align: left;
}
</style>