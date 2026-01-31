# Migration Guide Overview

This guide helps you upgrade between versions of the Simple Site Framework smoothly.

## Version Support Policy

### Current Versions
- **v0.1.x**: Initial release, active development
- Future versions will follow semantic versioning

### Support Timeline
- **Major versions** (v1.x, v2.x): 18 months of support
- **Minor versions** (v0.1.x, v0.2.x): Supported until next minor release
- **Patch versions** (v0.1.0, v0.1.1): Immediate upgrade recommended

### Long-Term Support (LTS)
Starting with v1.0, LTS versions will be designated:
- Security fixes for 18 months
- Bug fixes for 12 months
- New features for 6 months

## Semantic Versioning

We follow [Semantic Versioning 2.0.0](https://semver.org/):

- **Major** (v1.0.0 → v2.0.0): Breaking changes
- **Minor** (v0.1.0 → v0.2.0): New features, backward compatible
- **Patch** (v0.1.0 → v0.1.1): Bug fixes, backward compatible

## Before You Upgrade

### 1. Check Current Version
```bash
npm list @zoyth/simple-site-framework
```

### 2. Review Breaking Changes
Read the migration guide for your target version:
- [v0.1 → v0.2](./v0.1-to-v0.2.md) (when available)
- [Changelog](./changelog.md)

### 3. Backup Your Code
```bash
git commit -am "Pre-upgrade checkpoint"
git tag pre-upgrade-v0.2
```

### 4. Update Dependencies
```bash
npm install @zoyth/simple-site-framework@latest
```

### 5. Run Migration Tool (Optional)
```bash
npx simple-site migrate
```

### 6. Test Thoroughly
- Run your test suite
- Manual QA on key pages
- Check for deprecation warnings

## Migration Tools

### Automated Migration
The framework includes automated migration tools to help with common upgrade scenarios:

```bash
# Interactive migration
npx simple-site migrate

# Dry run (see what would change)
npx simple-site migrate --dry-run

# Migrate to specific version
npx simple-site migrate --to=0.2.0

# Skip interactive prompts
npx simple-site migrate --yes
```

### What Gets Migrated
- ✅ Component imports
- ✅ Prop names and values
- ✅ Config file structure
- ✅ Deprecated API usage
- ⚠️ Custom code (manual review needed)

## Deprecation Policy

### Deprecation Process
1. **Announce**: Deprecation warning added in minor version
2. **Maintain**: Deprecated feature still works for one major version
3. **Remove**: Feature removed in next major version

### Example Timeline
- v0.5: Feature deprecated, warning shown
- v0.6-0.9: Feature still works, warning continues
- v1.0: Feature removed

### Handling Deprecations
```tsx
// Deprecated in v0.5 - warning in console
<Button type="primary">Click</Button>

// New API (works in v0.5+)
<Button variant="filled">Click</Button>

// Both work in v0.5-0.9
// Only new API works in v1.0+
```

## Breaking Changes

Breaking changes are **only** introduced in major versions. Minor and patch versions are always backward compatible.

### Types of Breaking Changes
- Removed features
- Changed default behavior
- Required new dependencies
- Config structure changes
- Renamed components/props
- Changed TypeScript types

### How We Communicate Breaks
1. **Migration guide**: Detailed upgrade instructions
2. **Changelog**: Summary of all changes
3. **Release notes**: Highlights and recommendations
4. **Deprecation warnings**: In-app notifications before removal

## Getting Help

### Documentation
- [Migration Guides](./overview.md)
- [Changelog](./changelog.md)
- [GitHub Releases](https://github.com/zoyth/simple-site-framework/releases)

### Support
- **Issues**: [GitHub Issues](https://github.com/zoyth/simple-site-framework/issues)
- **Discussions**: [GitHub Discussions](https://github.com/zoyth/simple-site-framework/discussions)
- **Community**: Check for community posts about similar upgrades

### Before Filing an Issue
1. Read the migration guide
2. Check existing issues
3. Run `npx simple-site migrate`
4. Include version numbers and error messages

## Migration Checklist

Use this checklist for every upgrade:

- [ ] Read migration guide for target version
- [ ] Review changelog
- [ ] Backup code (git commit + tag)
- [ ] Update package.json
- [ ] Run `npm install`
- [ ] Run `npx simple-site migrate` (if available)
- [ ] Fix TypeScript errors
- [ ] Fix deprecation warnings
- [ ] Run test suite
- [ ] Manual QA testing
- [ ] Check for console warnings
- [ ] Review bundle size impact
- [ ] Update documentation
- [ ] Deploy to staging
- [ ] Monitor for issues

## Rollback Plan

If upgrade causes issues:

### Quick Rollback
```bash
# Revert to previous version
git reset --hard pre-upgrade-v0.2
npm install
```

### Gradual Upgrade
If full upgrade is risky:

1. **Create feature branch**
   ```bash
   git checkout -b upgrade-v0.2
   ```

2. **Upgrade in stages**
   - Update framework
   - Migrate one route/feature at a time
   - Test between each migration

3. **Merge when stable**
   ```bash
   git checkout main
   git merge upgrade-v0.2
   ```

## Version-Specific Guides

- [v0.1 → v0.2](./v0.1-to-v0.2.md) (example, create when needed)
- [Changelog](./changelog.md)

## Best Practices

1. **Upgrade regularly** - Don't fall too far behind
2. **Read release notes** - Stay informed about changes
3. **Test in staging first** - Never upgrade production directly
4. **Use lock files** - Commit package-lock.json
5. **Monitor deprecations** - Fix warnings before they break
6. **Keep dependencies updated** - Framework peer dependencies too
7. **Automated tests** - Catch regressions early
8. **Document custom code** - Note why you did something unconventional

## FAQ

**Q: Can I skip versions?**
A: Yes, but read all intermediate migration guides. Run `npx simple-site migrate` to handle multiple version jumps.

**Q: Will my site break on upgrade?**
A: Minor/patch upgrades are backward compatible. Major upgrades may have breaking changes, but migration tools help.

**Q: How long are versions supported?**
A: See [Version Support Policy](#version-support-policy) above.

**Q: What if migration tool doesn't work?**
A: File an issue with details. Manual migration is always an option using the guides.

**Q: Should I upgrade immediately?**
A: For patches, yes. For minor/major versions, test in staging first.

**Q: Can I stay on old version?**
A: Yes, but you won't get security fixes after support ends. Plan upgrades accordingly.
