import {Key, useMemo} from 'react';
import styles from './index.module.scss'
import {StartNodeConfig} from "../../core/FlowCore.tsx";

interface IProps {
  [key: string]: any
}

export default (props: IProps) => {
  const {title, content, showButton, goConfig} = props;

  const startNameList = useMemo(() => {
    return StartNodeConfig.map(item => item.type)
  }, [])

  const eventIcon = 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/pop_event.png';
  const  reactionIcon = 'https://s3-gzpu.didistatic.com/tiyan-base-store/suda/organizer/icons/pop_reaction.png'
  return (
    <div className={styles['content-wrap']}>
      <div className={styles['title']}>{title}</div>
      <div className={styles['content']}>
        {
          content && content.length ? (
            <div>
              {
                content.map((item: any, index: Key | null | undefined) => {
                  return (
                    <div key={index} className={styles['item']}>
                      <img src={startNameList.includes(item.type) ? eventIcon : reactionIcon} className={styles['icon']}  alt={''}/>
                      <span>{item.desc}</span>
                    </div>
                  )
                })
              }
            </div>
          ) : (
            <>
            <div>
              暂未配置
            </div>
              {
                showButton && (
                  <div className={styles['button']} onClick={() => {
                    goConfig?.()
                  }}>
                    去配置
                  </div>
                )
              }
          </>
          )
        }
      </div>
    </div>
  )
}
