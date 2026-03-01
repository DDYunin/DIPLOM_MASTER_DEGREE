<script setup>
import { ref, watch, onMounted } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import Tree from "primevue/tree";
import TreeSelect from "primevue/treeselect";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import ToggleButton from "primevue/togglebutton";
import Dialog from "primevue/dialog";
import Toast from "primevue/toast";

const confirm = useConfirm();
const toast = useToast();

// Состояние компонента
const nodes = ref([]);
const expandedKeys = ref({});
const searchText = ref("");
const expanded = ref(false);
const nodeDialogVisible = ref(false);
const editMode = ref(false);
const selectedNode = ref(null);

const nodeForm = ref({
  key: null,
  label: "",
  parentKey: null,
});

// Загрузка данных (заглушка)
const loadData = async() => {
  try {
    // Имитация загрузки данных с сервера
    await new Promise(resolve => setTimeout(resolve, 500));

    // Пример данных - в реальном приложении загружайте с API
    nodes.value = [
      {
        key: "key-0",
        label: "ИИТММ",
        children: [
          {
            key: "key-0-0",
            label: "ФИИТ",
            children: [
              {
                key: "key-0-1-0",
                label: "382006-1",
              },
              {
                key: "key-0-1-1",
                label: "382006-2",
              },
            ],
          },
          {
            key: "key-0-1",
            label: "ПМИ",
          },
          {
            key: "key-0-2",
            label: "ПРИНЖ",
          },
          {
            key: "key-0-3",
            label: "ПИ",
          },
        ],
      },
    ];

    // Развернуть первый уровень по умолчанию
    expandFirstLevel();
    toast.add({ severity: "success", summary: "Данные загружены", life: 3000 });
  } catch (error) {
    toast.add({ severity: "error", summary: "Ошибка загрузки", detail: error.message, life: 5000 });
  }
};

// Развернуть первый уровень
const expandFirstLevel = () => {
  expandedKeys.value = nodes.value.reduce((acc, node) => {
    acc[node.key] = true;
    return acc;
  }, {});
};

// Обработчики событий
const onNodeSelect = (node) => {
  debugger;
  selectedNode.value = node;
};

const showAddDialog = () => {
  debugger;
  editMode.value = false;
  nodeForm.value = {
    key: null,
    label: "",
    parentKey: selectedNode.value?.key || null,
  };
  nodeDialogVisible.value = true;
};

const editNode = (node) => {
  if (!node?.key) {
    return;
  }
  editMode.value = true;
  nodeForm.value = {
    key: node.key,
    label: node.label,
    parentKey: findParentKey(node.key),
  };
  nodeDialogVisible.value = true;
};

const findParentKey = (key) => {
  // Поиск родителя в структуре
  debugger;
  const findParent = (items) => {
    for (const item of items) {
      if (item.children) {
        if (item.children.some(child => child.key === key)) {
          return item.key;
        }
        const found = findParent(item.children);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  return findParent(nodes.value);
};

const saveNode = () => {
  debugger;
  if (editMode.value) {
    // Обновление существующего узла
    updateNode(nodes.value, nodeForm.value.key, nodeForm.value);
  } else {
    // Добавление нового узла
    addNode(nodes.value, nodeForm.value.parentKey, {
      key: Date.now().toString(),
      label: nodeForm.value.label,
    });
  }

  nodeDialogVisible.value = false;
  toast.add({ severity: "success", summary: "Сохранено", life: 3000 });
};

const updateNode = (items, key, newData) => {
  debugger;
  for (const item of items) {
    if (item.key === key) {
      item.label = newData.label;
      return true;
    }
    if (item.children && updateNode(item.children, key, newData)) {
      return true;
    }
  }
  return false;
};

const addNode = (items, parentKey, newNode) => {
  debugger;
  if (!parentKey) {
    items.push(newNode);
    expandedKeys.value[newNode.key] = true;
    return true;
  }

  for (const item of items) {
    if (item.key === parentKey) {
      if (!item.children) {
        item.children = [];
      }
      item.children.push(newNode);
      expandedKeys.value[parentKey] = true;
      return true;
    }
    if (item.children && addNode(item.children, parentKey, newNode)) {
      return true;
    }
  }
  return false;
};

const confirmDelete = (node) => {
  confirm.require({
    message: `Вы уверены, что хотите удалить "${node.label}"? Все дочерние элементы также будут удалены.`,
    header: "Подтверждение удаления",
    icon: "pi pi-exclamation-triangle",
    accept: () => {
      deleteNode(nodes.value, node.key);
      toast.add({ severity: "success", summary: "Удалено", life: 3000 });
    },
  });
};

const deleteNode = (items, key) => {
  debugger;
  for (let i = 0; i < items.length; i++) {
    if (items[i].key === key) {
      items.splice(i, 1);
      return true;
    }
    if (items[i].children && deleteNode(items[i].children, key)) {
      if (items[i].children.length === 0) {
        delete items[i].children;
      }
      return true;
    }
  }
  return false;
};

// Отслеживание изменения состояния "развернуть/свернуть все"
watch(expanded, (val) => {
  if (!val) {
    // Развернуть все узлы
    const expandAll = (items) => items.reduce((acc, item) => {
      acc[item.key] = true;
      if (item.children) {
        Object.assign(acc, expandAll(item.children));
      }
      return acc;
    }, {});
    expandedKeys.value = expandAll(nodes.value);
  } else {
    // Свернуть все узлы
    expandedKeys.value = {};
  }
});

// Инициализация
onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="hierarchy-container">
    <div class="toolbar">
      <div class="search-container">
        <Button
          v-tooltip="'Обновить данные'"
          icon="pi pi-refresh"
          class="p-button-text"
          @click="loadData"
        />
      </div>

      <div class="controls">
        <ToggleButton
          v-model="expanded"
          on-label="Развернуть все"
          off-label="Свернуть все"
          on-icon="pi pi-plus"
          off-icon="pi pi-minus"
          class="toggle-btn"
        />

        <Button
          label="Добавить элемент"
          icon="pi pi-plus"
          class="p-button-outlined"
          @click="showAddDialog"
        />
      </div>
    </div>

    <Tree
      :value="nodes"
      :expanded-keys="expandedKeys"
      :filter="searchText"
      filter-mode="lenient"
      selection-mode="single"
      :meta-key-selection="false"
      class="hierarchy-tree"
      @node-select="onNodeSelect"
    >
      <template #default="slotProps">
        <div class="node-content">
          <span class="node-label">{{ slotProps.node.label }}</span>
          <div class="node-actions">
            <Button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-text p-button-sm"
              @click.stop="editNode(slotProps.node)"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-text p-button-sm p-button-danger"
              @click.stop="confirmDelete(slotProps.node)"
            />
          </div>
        </div>
      </template>
    </Tree>

    <!-- Диалог добавления/редактирования элемента -->
    <Dialog
      v-model:visible="nodeDialogVisible"
      :header="editMode ? 'Редактирование элемента' : 'Новый элемент'"
      :modal="true"
      class="node-dialog"
    >
      <div class="form-grid">
        <div class="field">
          <label for="label">Название</label>
          <InputText
            id="label"
            v-model="nodeForm.label"
          />
        </div>

        <div class="field">
          <label for="parent">Родительский элемент</label>
          <TreeSelect
            id="parent"
            v-model="nodeForm.parentKey"
            :options="nodes"
            option-label="label"
            option-value="key"
            placeholder="Выберите родителя"
            :class="{ 'p-invalid': !nodeForm.parentKey && editMode }"
          />
        </div>
      </div>

      <template #footer>
        <Button
          label="Отмена"
          icon="pi pi-times"
          class="p-button-text"
          @click="nodeDialogVisible = false"
        />
        <Button
          :label="editMode ? 'Обновить' : 'Создать'"
          icon="pi pi-check"
          :disabled="!nodeForm.label"
          @click="saveNode"
        />
      </template>
    </Dialog>
    <Toast />
  </div>
</template>

<style scoped>
.hierarchy-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.search-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.toggle-btn {
  width: 150px;
}

.hierarchy-tree {
  flex: 1;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  overflow: hidden;
}

.node-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.node-label {
  flex: 1;
}

.node-actions {
  display: flex;
  gap: 0.5rem;
}

.node-dialog .form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.node-dialog .field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .search-container {
    width: 100%;
  }

  .search-input {
    width: 100%;
  }

  .controls {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
