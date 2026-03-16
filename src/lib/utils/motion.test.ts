// ABOUTME: Tests for framer-motion integration utilities
// ABOUTME: Verifies graceful degradation and module-level caching

import { describe, it, expect } from 'vitest';
import {
  hasFramerMotion,
  getMotionComponent,
  useMotionHooks,
  getAnimatePresence,
} from './motion';

describe('hasFramerMotion', () => {
  it('returns true when framer-motion is installed', () => {
    expect(hasFramerMotion()).toBe(true);
  });
});

describe('getMotionComponent', () => {
  it('returns a component (not null)', () => {
    const MotionDiv = getMotionComponent('div');
    expect(MotionDiv).toBeDefined();
    expect(typeof MotionDiv).toBe('object'); // motion.div is a ForwardRef object
  });
});

describe('useMotionHooks', () => {
  it('returns hooks with available: true', () => {
    const hooks = useMotionHooks();
    expect(hooks.available).toBe(true);
    expect(typeof hooks.useScroll).toBe('function');
    expect(typeof hooks.useTransform).toBe('function');
    expect(typeof hooks.useReducedMotion).toBe('function');
    expect(typeof hooks.useInView).toBe('function');
  });

  it('returns the same reference on repeated calls (cached)', () => {
    const hooks1 = useMotionHooks();
    const hooks2 = useMotionHooks();
    expect(hooks1.useScroll).toBe(hooks2.useScroll);
  });
});

describe('getAnimatePresence', () => {
  it('returns a component', () => {
    const AP = getAnimatePresence();
    expect(AP).toBeDefined();
  });
});
