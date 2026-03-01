<script setup>
import HeaderAdmin from "@/components/HeaderAdmin.vue";
import UsersTab from "@/components/UsersTab.vue";
import HierarchyTab from "@/components/HierarchyTab.vue";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";


const handleLogout = () => {
  console.log("Logout action");
};
</script>


<template>
  <div class="main-container">
    <HeaderAdmin />
    <div class="content-container">
      <TabView>
        <TabPanel header="Пользователи">
          <UsersTab />
        </TabPanel>
        <TabPanel header="Иерархия">
          <HierarchyTab />
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content-container {
  flex: 1;
  padding: 1.5rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}
</style>
