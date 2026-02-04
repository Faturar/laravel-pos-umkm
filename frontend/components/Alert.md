# Reusable Alert Component

This document explains how to use the reusable Alert component in your application.

## Overview

The Alert system consists of three main parts:

1. `Alert.tsx` - The actual alert component
2. `useAlert.ts` - A custom hook for managing alert state
3. `AlertProvider.tsx` - A context provider to make alerts available throughout the app

## Basic Usage

The easiest way to use alerts is through the `AlertProvider` context, which has been set up in your application's layout.

### In any component:

```tsx
"use client"

import { useAlertContext } from "@/components/AlertProvider"

export default function MyComponent() {
  const { showError, showSuccess, showWarning, showInfo } = useAlertContext()

  const handleAction = () => {
    try {
      // Do something that might succeed
      showSuccess("Action completed successfully!")
    } catch (error) {
      // Handle errors
      showError("Something went wrong. Please try again.")
    }
  }

  return <button onClick={handleAction}>Perform Action</button>
}
```

## Available Alert Types

The Alert component supports four types of alerts:

1. **Error** (default) - Red background for errors
2. **Success** - Green background for successful operations
3. **Warning** - Yellow background for warnings
4. **Info** - Blue background for informational messages

## Alert Context Methods

The `useAlertContext` hook provides these methods:

- `showAlert(message: string, type?: 'error' | 'success' | 'warning' | 'info')` - Show an alert with specified type
- `showError(message: string)` - Show an error alert
- `showSuccess(message: string)` - Show a success alert
- `showWarning(message: string)` - Show a warning alert
- `showInfo(message: string)` - Show an info alert
- `hideAlert()` - Manually hide the current alert

## Advanced Usage

If you need more control over the alert behavior, you can use the `Alert` component directly:

```tsx
import Alert from "@/components/Alert"
import { useState } from "react"

export default function MyComponent() {
  const [showAlert, setShowAlert] = useState(false)

  return (
    <div>
      <button onClick={() => setShowAlert(true)}>Show Alert</button>

      <Alert
        message="This is a custom alert"
        type="error"
        isVisible={showAlert}
        onClose={() => setShowAlert(false)}
        autoClose={true}
        autoCloseTime={3000}
      />
    </div>
  )
}
```

## Alert Component Props

| Prop            | Type                                          | Default   | Description                                  |
| --------------- | --------------------------------------------- | --------- | -------------------------------------------- |
| `message`       | `string`                                      | -         | The message to display in the alert          |
| `type`          | `'error' \| 'success' \| 'warning' \| 'info'` | `'error'` | The type of alert to display                 |
| `isVisible`     | `boolean`                                     | `false`   | Whether the alert is visible                 |
| `onClose`       | `() => void`                                  | -         | Function to call when the alert is closed    |
| `autoClose`     | `boolean`                                     | `true`    | Whether the alert should close automatically |
| `autoCloseTime` | `number`                                      | `5000`    | Time in milliseconds before auto-closing     |

## Styling

The alert component uses Tailwind CSS classes for styling. It has a fixed position at the top center of the screen with a rounded appearance similar to the design in `sign-in-student.html`.

The color schemes for each alert type are:

- Error: `bg-red-500`
- Success: `bg-green-500`
- Warning: `bg-yellow-500`
- Info: `bg-blue-500`

You can customize these colors by modifying the `getAlertStyles` function in the `Alert.tsx` component.
