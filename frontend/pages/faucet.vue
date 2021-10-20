<template>
  <div>
    <section>
      <b-container class="main py-5">
        <b-row>
          <b-col cols="12">
            <h1>
              {{ $t('pages.faucets.faucet') }}
            </h1>
          </b-col>
        </b-row>
        <b-form-row class="mt-5 no-flex">
          <b-col cols="2">
            <h6>Select Network:</h6>
          </b-col>
          <b-col cols="10">
            <select v-model="network" class="custom-select">
              <option value="testnet">Testnet</option>
              <option value="devnet">Devnet</option>
              <option value="qanet">QAnet</option>
            </select>
          </b-col>
        </b-form-row>
        <b-form-row class="mt-3 mb-5 no-flex">
          <b-col cols="2"> <h6>Account ID:</h6> </b-col>
          <b-col cols="10">
            <input
              v-model="address"
              class="form-control"
              placeholder="Enter Account Id"
            />
          </b-col>
        </b-form-row>
        <b-form-row class="flex">
          <b-button class="button" @click="api">Button</b-button>
        </b-form-row>
      </b-container>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      network: 'testnet',
      address: null,
    }
  },
  methods: {
    api(event) {
      alert('iamcalled')
    },
  },
}
</script>

<style>
.address {
  border-radius: 10px;
}

.no-flex {
  display: block !important;
}

select {
  border-radius: 10px;
}

select:focus {
  border: 1px solid #495057 !important;
}

input:focus {
  border: 1px solid #495057 !important;
}

.flex {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.button {
  border-radius: 10px;
}
</style>
