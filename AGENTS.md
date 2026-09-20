# Repository instructions

## Wrangler commands

- Run Wrangler through the 1Password Shell Plugin:

  ```sh
  op plugin run -- wrangler <arguments>
  ```

- Run the command outside the sandbox with a TTY so that 1Password authorization can be used.
- Do not invoke `wrangler` directly and do not use `pnpm exec wrangler`. Direct invocation can trigger Wrangler's own authentication flow instead of using the credentials configured in 1Password.
