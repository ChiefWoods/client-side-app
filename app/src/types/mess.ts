/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/mess.json`.
 */
export type Mess = {
  address: 'MESSWwDyEZF9D63ktc12VGEGA6huravzPNJj9gjYFqq';
  metadata: {
    name: 'mess';
    version: '0.1.0';
    spec: '0.1.0';
    description: 'Created with Anchor';
  };
  instructions: [
    {
      name: 'init';
      discriminator: [220, 59, 207, 236, 108, 250, 47, 100];
      accounts: [
        {
          name: 'payer';
          writable: true;
          signer: true;
        },
        {
          name: 'chat';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [103, 108, 111, 98, 97, 108];
              },
              {
                kind: 'account';
                path: 'payer';
              },
            ];
          };
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [];
    },
    {
      name: 'send';
      discriminator: [102, 251, 20, 187, 65, 75, 12, 69];
      accounts: [
        {
          name: 'sender';
          writable: true;
          signer: true;
        },
        {
          name: 'chat';
          writable: true;
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'text';
          type: 'string';
        },
      ];
    },
  ];
  accounts: [
    {
      name: 'chat';
      discriminator: [170, 4, 71, 128, 185, 103, 250, 177];
    },
  ];
  errors: [
    {
      code: 6000;
      name: 'textTooLong';
      msg: 'Text cannot be longer than 256 characters';
    },
    {
      code: 6001;
      name: 'textEmpty';
      msg: 'Text cannot be empty';
    },
  ];
  types: [
    {
      name: 'chat';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'messages';
            type: {
              vec: {
                defined: {
                  name: 'message';
                };
              };
            };
          },
        ];
      };
    },
    {
      name: 'message';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'sender';
            type: 'pubkey';
          },
          {
            name: 'text';
            type: 'string';
          },
        ];
      };
    },
  ];
};
