# Guidelines for Claude

## Workflow
- Run `npm run build` followed by conventional commit and push after each incremental feature
- Test functionality after each significant change before committing
- Use proper semantic commit messages (feat, fix, docs, etc.)

## Project-Specific Notes
- This is a Next.js 15 project with App Router, TypeScript, TailwindCSS
- Marscoin is custom blockchain (fork of Litecoin/Bitcoin) - NOT an Ethereum token
- Network params: pubKeyHash 0x32, scriptHash 0x32, wif 0xb2
- HD wallet path: m/44'/2'/0'/0/0 (coin type 2 from Litecoin)
- Use bitcoinjs-lib with custom Marscoin network parameters
- Main mock address format: M8vXitQJpXvKRGkKPzDJgRVioNLqvNnecM

## Common Conventions
- Use absolute imports with @/ prefix
- Use server-side fetching when possible
- Use suspense and error boundaries for loading/error states
- Check CURRENT.md for current project status
- Check DEVELOPMENT.md for development roadmap
- Refer to original Laravel repo at ../../OSS/martianrepublic for implementation patterns