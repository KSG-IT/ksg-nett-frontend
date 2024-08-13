# CHANGELOG

## [unreleased]

## [2024.8.1]

### Added

- Schedules
  - New location options [Servering C, Servering D, Servering K]
  - New page to see allergies

## [2024.3.1]

### Added

- Economy: Stock market mode
  - Display sotck market shortcut on dashboard if feature is enabled
  - Add view to show active stock prices on different products
  - Add controller view to jack up price and crash market

## [2023.9.1] - 2023-9-12

### Removed

- Dashboard: Remove KSG-IT recruitement post
- Forum: Remove module

### Changed

- Improved whats new popup, replacing affix with a modal. Also inverting the hide check to hide by default and flip value based on localstorage value

## [2023.8.2] - 2023-8-21

### Added

- Admissions
  - Display a warning if an applicant applies to a position that has 'functionary' member type

### Changed

- Dependencies
  - Upgrade mantine patch v6.0.17 -> v6.0.18

## [2023.8.1] - 2023-8-3

### Added

- Login
  - Authenticate if token is in url
- Economy
  - Debt collection default amount set to owed amount
- Admission:
  - Applicant recommendation feature
  - Applicant overview search
  - Phone verification on applicant registration
  - Interview booking override toggles
  - Interview default text in interview configuration
  - Order by modes in discussion table
- Forum
  - Bootstrap module

### Changed

- Dependencies
  - Upgrade mantine to v6
- Admission
  - Applicant priorities moved from interview edit to applicant summary screen
- Misc.
  - Change bookmark icon

### Removed

- Dependencies
  - remove styled-components
  - remove react-hot-toast

## [v2023.5.1] - 2023-05-06

### Added

- Whats new popup

## [v2023.4.1] - 2023-04-18

### Added

- Economy
  - CreateSociSessionModal add `minimumRequiredBalance` field to form
  - Refactor SociSessionsTable to use menu items for actions
  - Replace react-hot-toast usage
  - Fix incorrect typing
- vite config: add sourcemap option

### Changed

- Economy
  - Refactor SociSessionsTable to use menu items for actions
  - Replace react-hot-toast usage

### Fixed

- Economy
  - broken typing causing incorrect error toasts/notifications

## [v2023.3.3] - 2023-03-10

### Added

- Economy
  - Deposits table
    - Delete deposit
    - Correct amount and approve deposit
    - Deposit method as a table column
  - Soci sessions
    - Add option to overcharge an account when adding product orders
  - My economy
    - Add external charge QR code url behind superuser permission
    - Add delete mutation to last deposits table

### Changed

- Economy
  - Deposit form
    - Remove description field from stripe deposit
    - Replace bank transfer deposit description with date picker
    - Append date to bank transfer deposit description

### Fixed

- Navbar
  - Replace economy dashboard navitem permission with 'economy.view_socisession'
- Routes
  - Missing permission wrapper on EconomyDashboard

## [v2023.3.2] - 2023-03-07

### Fixed

- Economy: Debt collection. Re-add missing deposit form

## [v2023.3.1] - 2023-03-03

### Changed

- Economy: Deposit form bank transfer and two-step stripe deposit
- Economy: Move navitems from sidebar to own dashboard

## [v2023.2.3] - 2023-02-14

### Added

- Economy: Stripe deposit integration

### Removed

- Economy: Lists deposit view

## [v2023.2.2] - 2023-02-10

### Fixed

- Economy: Incorrect deposits view permission check

## [v2023.2.1] - 2023-02-09

### Fixed

- Schedules: Edit shift date bug

## [v2023.1.7] - 2023-01-28

### Added

- Users: View to show new additions to KSG
- Header: Display webapp version number

## [v2023.1.6] - 2023-01-27

### Added

- Handbook: create new documents
- Handbook: edit documents
- Handbook: delete documents

### Changed

- Handbook: styling improvements

### Fixed

- Header: User search laggy performance
- Schdules: Missing 'kontoret' option
- schedules: Missing 'ryddevakt' option

## [v2023.1.5] - 2023-01-??

Things happend. Not sure what.

## [v2023.1.4] - 2023-01-15

### Added

- Payment details and upcoming shift in debt collection view
- Currency formatter hook

### Fixed

- ShiftSlot card fixes
  - Reduce font size
  - Fix overflow bug
  - Change from nickname to cleanname

### Changed

- Icon changes

## [v2023.1.3] - 2023-01-14

### Added

- Interview overview
  - Can add interview
  - Can re-assign applicants to interview
  - Can remove applicant from interview
- Edit interview cmd/ctl + s to save
- Internal group highlights tab
  - Add new highlight
  - Edit highlight
- Edit interview save keyboard command

### Removed

- Interview allocation and todays interview views

## [v2023.1.2] - 2023-01-13

### Added

- Soci order session invite other users

## [2023.1.1] - 2023-01-07

First release.

### Added

- Quote module
- Schedule module
- Bar tab module
- Admission module
- Economy module
- Login module
- Summary module
- User module
- Handbook module
- Organization module
