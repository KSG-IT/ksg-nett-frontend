6.x → 7.x migration guide
This guide is intended to help you migrate your project styles from 6.x to 7.x. It is not intended to be a comprehensive guide to all the changes in 7.x. For that, please see the 7.0.0 changelog.

Migration to @mantine/emotion
@mantine/emotion package is available starting from version 7.9. If you do not want to use CSS modules, have a lot of styles created with createStyles, sx and styles props, or just prefer CSS-in-JS syntax, you can migrate to @mantine/emotion. To view the full documentation for @mantine/emotion package, visit this page.

createStyles and Global component
createStyles function and Global component are no longer available in @mantine/core package. Change imports to @mantine/emotion:

// 6.x
import { createStyles, Global } from '@mantine/core';

// 7.x
import { createStyles, Global } from '@mantine/emotion';
sx and styles props
sx and styles props available in 7.x the same way as in 6.x after setup:

// 6.x and 7.x, no changes
import { Box, Button } from '@mantine/core';

function Demo() {
return (
<>
<Box
sx={(theme) => ({ backgroundColor: theme.colors.red[5] })}
/>
<Button styles={{ root: { height: 50 } }} />
</>
);
}
theme.colorScheme
In v7 color scheme value is managed by MantineProvider, theme object no longer includes colorScheme property. Although it is still possible to access color scheme value in components with useMantineColorScheme hook, it is not recommended to base your styles on its value. Instead, use light/dark utilities.

Example of 6.x createStyles with theme.colorScheme migration to 7.0:

// 6.x
import { createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({
root: {
backgroundColor:
theme.colorScheme === 'dark'
? theme.colors.dark[6]
: theme.colors.gray[0],
color: theme.colorScheme === 'dark' ? theme.white : theme.black,
},
}));
// 7.x
import { createStyles } from '@mantine/emotion';

const useStyles = createStyles((theme, \_, u) => ({
root: {
[u.dark] {
backgroundColor: theme.colors.dark[6];
color: theme.white;
},

    [u.light]: {
      backgroundColor: theme.colors.gray[0];
      color: theme.black;
    },

},
}));
Migration to CSS modules
Before getting started, it is recommended to go through styles documentation. Most notable parts:

CSS Modules
Mantine PostCSS preset
CSS variables
data-\* attributes
Styles API
Responsive styles
Note that this guide assumes that you have postcss-preset-mantine installed and configured in your project.

createStyles
createStyles function is no longer available in 7.0. Use CSS Modules instead.

// 6.x
import { createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({
root: {
backgroundColor: theme.colors.red[5],
},
}));
/_ 7.0 _/
.root {
background-color: var(--mantine-color-red-5);
}
sx prop
sx and prop is no longer available in 7.0. Use className or style prop instead.

// 6.x
import { Box } from '@mantine/core';

function Demo() {
return (
<Box sx={(theme) => ({ backgroundColor: theme.colors.red[5] })} />
);
}
// 7.0
import { Box } from '@mantine/core';

function Demo() {
return (
<Box style={{ backgroundColor: 'var(--mantine-color-red-5)' }} />
);
}
Nested selectors are not supported in style prop, use className instead:

// 6.x
import { Box } from '@mantine/core';

function Demo() {
return <Box sx={{ '&:hover': { background: 'red' } }} />;
}
.box {
&:hover {
background: red;
}
}
styles prop
styles prop no longer supports nested selectors. Use classNames instead to apply styles to nested elements.

// 6.x – nested selectors
import { TextInput } from '@mantine/core';

function Demo() {
return (
<TextInput
styles={{
        input: {
          '&:focus': {
            color: 'red',
          },
        },
      }}
/>
);
}
/_ 7.0 _/
.input {
&:focus {
color: red;
}
}
Regular selectors are still supported:

// Works both in 6.x and 7.x
import { TextInput } from '@mantine/core';

function Demo() {
return (
<TextInput
styles={{
        input: {
          color: 'red',
        },
      }}
/>
);
}
Global styles
Global component and global styles on theme are not available in 7.0. Instead, create a global stylesheet (.css file) and import it in your application entry point.

// 6.x
import { Global } from '@mantine/core';

function Demo() {
return (
<Global
styles={(theme) => ({
'_, _::before, \*::after': {
boxSizing: 'border-box',
},

        body: {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[7]
              : theme.white,
          color:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[0]
              : theme.black,
          lineHeight: theme.lineHeight,
        },

        '.your-class': {
          backgroundColor: 'red',
        },

        '#your-id > [data-active]': {
          backgroundColor: 'pink',
        },
      })}
    />

);
}
/_ 7.0 _/
/_ src/index.css _/
_,
_::before,
\*::after {
box-sizing: border-box;
}

body {
background-color: light-dark(
var(--mantine-color-white),
var(--mantine-color-dark-7)
);
color: light-dark(
var(--mantine-color-black),
var(--mantine-color-white)
);
line-height: var(--mantine-line-height);
}

.your-class {
background-color: red;
}

#your-id > [data-active] {
background-color: pink;
}
theme referencing
All theme properties are now available as CSS variables. It is recommended to use CSS variables instead of referencing theme object in styles.

// 6.x
import { Box } from '@mantine/core';

function Demo() {
return (
<Box
sx={(theme) => ({
backgroundColor: theme.colors.red[6],
color: theme.white,
padding: `calc(${theme.spacing.xl} * 2)`,
})}
/>
);
}
/_ 7.0 _/
.box {
background-color: var(--mantine-color-red-6);
color: var(--mantine-color-white);
padding: calc(var(--mantine-spacing-xl) \* 2);
}
theme.colorScheme
Color scheme value is managed by MantineProvider, theme object no longer includes colorScheme property. Although it is still possible to access color scheme value in components with useMantineColorScheme hook, it is not recommended to base your styles on its value. Instead, use light/dark mixins or light-dark CSS function.

Example of 6.x createStyles with theme.colorScheme migration to 7.0:

// 6.x
import { createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({
root: {
backgroundColor:
theme.colorScheme === 'dark'
? theme.colors.dark[6]
: theme.colors.gray[0],
color: theme.colorScheme === 'dark' ? theme.white : theme.black,
},
}));
/_ 7.0 _/

/_ With light-dark function _/
.root {
background-color: light-dark(
var(--mantine-color-gray-0),
var(--mantine-color-dark-6)
);
color: light-dark(
var(--mantine-color-black),
var(--mantine-color-white)
);
}

/_ With light/dark mixins _/
.root {
background-color: var(--mantine-color-gray-0);
color: var(--mantine-color-black);

@mixin dark {
background-color: var(--mantine-color-dark-6);
color: var(--mantine-color-white);
}
}
Note that if your application has server-side rendering, you should not render any elements based on its value (more info). Instead, use light/dark mixins or light-dark function to hide/display elements based on color scheme value.

Color scheme toggle example:

import { ActionIcon, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import cx from 'clsx';
import classes from './Demo.module.css';

function Demo() {
const { setColorScheme } = useMantineColorScheme();
const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

return (
<ActionIcon
onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
variant="default"
size="xl"
aria-label="Toggle color scheme" >
<IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />
<IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} />
</ActionIcon>
);
}
