import useClickOutside from 'hooks/useClickOutside'
import { useRef } from 'react'
import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/react'
import { customRender, customRenderHook } from 'utils/tests'

describe('useClickOutside', () => {
  test('click outside', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()

    const Component = () => {
      const firstBtnRef = useRef<HTMLButtonElement>(null!)
      useClickOutside(firstBtnRef, handleClick)

      return (
        <div data-testid='container'>
          <button data-testid='first-btn' ref={firstBtnRef}>
            First button
          </button>
          <button data-testid='second-btn'>Second button</button>
        </div>
      )
    }

    customRender(<Component />)

    expect(handleClick).toHaveBeenCalledTimes(0)

    await user.click(screen.getByTestId('second-btn'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
