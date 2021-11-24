<template>
    <div>
        <Car v-on: clickedSomething="handleClickInParent" />
    <!-- or -->
    <Car @clickedSomething="handleClickInParent" />
  </div>
</template>
    <script>
        export default {

            name: 'App',
              methods: {
                        handleClickInParent: function(param1, param2) {
             
                        },
                         handleClick: function() {
                            this.$root.$emit('clickedSomething');
                        }
             },
            
         }
</script>