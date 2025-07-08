'use client'
import { FC, ReactNode } from 'react'
import { ConfigProvider } from './ConfigContext'
import { QubicConnectCombinedProvider } from './QubicConnectContext'
import { HM25Provider } from './HM25Context'

const QubicWalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ConfigProvider>
      <QubicConnectCombinedProvider>
        <HM25Provider>{children}</HM25Provider>
      </QubicConnectCombinedProvider>
    </ConfigProvider>
  )
}

export default QubicWalletProvider
