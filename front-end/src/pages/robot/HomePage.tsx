/** @jsx jsx */
import { useState, useEffect } from 'react'
import { css, jsx } from '@emotion/core'
import { PageToChange, PageParams, Robot } from '../RobotPage'

interface RobotStatus {
  id: number
  name: string
  floor: number
  available?: boolean
  status?: '대기' | '이동중' | '도착'
  onService?: boolean
}

const Button = css`
  /* position: absolute; */
  /* margin-top: 70%; */
  font-size: 20px;
  font-weight: 600;
  width: 200px;
  height: 27px;
  margin-right: 10px;
  margin-bottom: 20px;
  border-radius: 12px;
  background-color: #e0e5ec;
  /* background-color: #C2CBD9; */
  box-shadow: 9px 9px 16px rgb(163, 177, 198, 0.6),
    -9px -9px 16px rgba(255, 255, 255, 0.5);
`
interface HomePageParams extends PageParams {
  setRobot: React.Dispatch<React.SetStateAction<Robot>>
}

function HomePage({ socket, setPageToChange, setRobot }: HomePageParams) {
  const [robotsToMatch, setRobotsToMatch] = useState<RobotStatus[]>([])

  useEffect(() => {
    socket.on('robots-available', (robots: string) => {
      const robotsToMatch: RobotStatus[] = JSON.parse(robots)
      setRobotsToMatch(robotsToMatch)
    })

    socket.on('changePageTo', (page: PageToChange) => {
      setPageToChange(page)
    })
  })

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const target = e.target as HTMLButtonElement
    const selectedRobot = robotsToMatch.filter((robot) => {
      return robot.id === Number(target.value)
    })[0]
    setRobot(selectedRobot)
    socket.emit('robotName', selectedRobot.name)
  }
  return (
    <div>
      <h1>이 부릉이는 어떤 부릉이??</h1>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
        `}
      >
        {robotsToMatch.map((robot) => (
          <button
            css={Button}
            key={robot.id}
            value={robot.id}
            onClick={handleClick}
          >{`${robot.floor}층 ${robot.name}`}</button>
        ))}
      </div>
    </div>
  )
}

export default HomePage
