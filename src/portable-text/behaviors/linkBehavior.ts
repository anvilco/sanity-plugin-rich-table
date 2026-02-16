import type {EditorSchema} from '@portabletext/editor'
import {defineBehavior, execute} from '@portabletext/editor/behaviors'
import * as selectors from '@portabletext/editor/selectors'

import {looksLikeUrl} from './looks-like-url'

export type LinkBehaviorsConfig = {
  linkAnnotation?: (context: {
    schema: EditorSchema
    url: string
  }) => {name: string; value: {[prop: string]: unknown}} | undefined
}

export function createLinkBehaviors(config: LinkBehaviorsConfig) {
  const pasteLinkOnSelection = defineBehavior({
    on: 'clipboard.paste',
    guard: ({snapshot, event}) => {
      const selectionCollapsed = selectors.isSelectionCollapsed(snapshot)
      const text = event.originEvent.dataTransfer.getData('text/plain')
      const url = looksLikeUrl(text) ? text : undefined

      if (url === undefined) {
        return false
      }

      const annotation = config.linkAnnotation?.({url, schema: snapshot.context.schema})

      if (!annotation || selectionCollapsed) {
        return false
      }

      return {annotation}
    },
    actions: [
      (_, {annotation}) => [
        execute({
          type: 'annotation.add',
          annotation,
        }),
      ],
    ],
  })
  const pasteLinkAtCaret = defineBehavior({
    on: 'clipboard.paste',
    guard: ({snapshot, event}) => {
      const focusSpan = selectors.getFocusSpan(snapshot)
      const selectionCollapsed = selectors.isSelectionCollapsed(snapshot)

      if (!focusSpan || !selectionCollapsed) {
        return false
      }

      const text = event.originEvent.dataTransfer.getData('text/plain')
      const url = looksLikeUrl(text) ? text : undefined

      if (url === undefined) {
        return false
      }

      const annotation = config.linkAnnotation?.({url, schema: snapshot.context.schema})

      if (!annotation) {
        return false
      }

      return {focusSpan, annotation, url}
    },
    actions: [
      (_, {annotation, url}) => [
        execute({
          type: 'insert.span',
          text: url,
          annotations: [annotation],
        }),
      ],
    ],
  })

  return [pasteLinkOnSelection, pasteLinkAtCaret]
}
