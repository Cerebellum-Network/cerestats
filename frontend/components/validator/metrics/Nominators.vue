<template>
  <div class="metric h-100">
    <div class="row mb-4">
      <div class="col-8">
        <h5 class="mb-0">
          Nominators
          <nuxt-link
            v-b-tooltip.hover
            event=""
            to="/"
            title="Evaluate nominators and if the validator is oversubscribed"
          >
            <font-awesome-icon
              icon="question-circle"
              class="d-inline-block"
              style="font-size: 1rem"
            />
          </nuxt-link>
        </h5>
      </div>
      <div class="col-4 text-right text-success">
        <Rating key="nominators" :rating="rating" />
      </div>
    </div>
    <div class="description">
      <p v-if="rating > 0">
        Detected {{ nominators }} nominator<span v-if="nominators > 1">s</span>,
        validator is not oversubscribed
      </p>
      <p v-else-if="rating === 0 && nominators > 0">
        Validator is oversubscribed ({{ nominators }} nominators)
      </p>
      <p v-else>Validator doesn't have any nominators</p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    nominators: {
      type: Number,
      default: () => 0,
    },
    rating: {
      type: Number,
      default: () => 0,
    },
  },
}
</script>
