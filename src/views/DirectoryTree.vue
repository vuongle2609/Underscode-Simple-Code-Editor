<template>
     <template
        v-for="{ fileClass, isFile, isOpen, name, path } in directoryStruct"
      >
        <ExplorerItem :name :isFile :fileClass :isOpen :path /> </template
    >
</template>