/**
 * @module `useAllDocs` may cause unnecessary double render,
 * this HOC is a workaround to prevent it.
 */
import { memo, useEffect, useMemo, useState } from 'react'
import { ResultType, useAllDocs } from 'use-pouchdb'

export type AllDocsOpts = Parameters<typeof useAllDocs>[0]
export type AllDocsChildProps<T extends object = {}> = Partial<
  Pick<
    ResultType<PouchDB.Core.AllDocsResponse<T>>,
    'offset' | 'rows' | 'total_rows' | 'update_seq'
  >
>
export type AllDocsProps<T extends object = {}> = AllDocsOpts & {
  render: (p: AllDocsChildProps<T>) => JSX.Element
  errorFallback?: JSX.Element
  loadingFallback?: JSX.Element
  loadingDelay?: number
}

export default function AllDocsWrapper<T extends object>(
  props: AllDocsProps<T>,
) {
  const { offset, rows, total_rows, update_seq, loading, error } =
    useAllDocs<T>(props)

  const Render = useMemo(() => memo(props.render), [props.render])

  const [delayedLoading, setDelayedLoading] = useState<boolean>(
    loading || false,
  )

  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        setDelayedLoading(true)
      }, props.loadingDelay || 1000)
      return () => clearTimeout(timeout)
    } else {
      setDelayedLoading(false)
    }
  }, [loading, props.loadingDelay])

  if (props.errorFallback && error) {
    return props.errorFallback
  }

  if (props.loadingFallback && delayedLoading) {
    return props.loadingFallback
  }

  return (
    <Render
      offset={offset}
      rows={rows}
      total_rows={total_rows}
      update_seq={update_seq}
    />
  )
}
