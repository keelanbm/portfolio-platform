'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { MentionInput } from '@/components/ui/mention-input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Heart, MessageCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { showToast } from '@/lib/toast'

interface Comment {
  id: string
  content: string
  tags: string[]
  createdAt: string
  user: {
    id: string
    username: string
    displayName: string
    avatarUrl: string
  }
  replies: Comment[]
  _count?: {
    likes: number
  }
}

interface CommentSectionProps {
  projectId: string
}

export default function CommentSection({ projectId }: CommentSectionProps) {
  const { user, isSignedIn } = useUser()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [newCommentTags, setNewCommentTags] = useState<string[]>([])
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/comments?projectId=${projectId}`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
      showToast.error('Failed to load comments', 'Please refresh the page to try again.')
    } finally {
      setLoading(false)
    }
  }, [projectId])

  // Fetch comments
  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !isSignedIn) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          projectId,
          tags: newCommentTags,
        }),
      })

      if (response.ok) {
        setNewComment('')
        setNewCommentTags([])
        fetchComments() // Refresh comments
        showToast.success('Comment posted', 'Your comment has been shared successfully.')
      } else {
        const errorData = await response.json()
        showToast.error('Failed to post comment', errorData.error || 'Please try again.')
      }
    } catch (error) {
      console.error('Error creating comment:', error)
      showToast.error('Failed to post comment', 'Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim() || !isSignedIn) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: replyContent,
          projectId,
          parentId,
          tags: [],
        }),
      })

      if (response.ok) {
        setReplyContent('')
        setReplyingTo(null)
        fetchComments() // Refresh comments
        showToast.success('Reply posted', 'Your reply has been added successfully.')
      } else {
        const errorData = await response.json()
        showToast.error('Failed to post reply', errorData.error || 'Please try again.')
      }
    } catch (error) {
      console.error('Error creating reply:', error)
      showToast.error('Failed to post reply', 'Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const addTag = (tag: string) => {
    if (tag.trim() && !newCommentTags.includes(tag.trim())) {
      setNewCommentTags([...newCommentTags, tag.trim()])
    }
  }

  const removeTag = (tagToRemove: string) => {
    setNewCommentTags(newCommentTags.filter(tag => tag !== tagToRemove))
  }

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim() || !isSignedIn) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editContent,
          tags: [],
        }),
      })

      if (response.ok) {
        setEditingComment(null)
        setEditContent('')
        fetchComments() // Refresh comments
        showToast.success('Comment updated', 'Your comment has been saved successfully.')
      } else {
        const errorData = await response.json()
        showToast.error('Failed to update comment', errorData.error || 'Please try again.')
      }
    } catch (error) {
      console.error('Error updating comment:', error)
      showToast.error('Failed to update comment', 'Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!isSignedIn || !confirm('Are you sure you want to delete this comment?')) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchComments() // Refresh comments
        showToast.success('Comment deleted', 'Your comment has been removed successfully.')
      } else {
        const errorData = await response.json()
        showToast.error('Failed to delete comment', errorData.error || 'Please try again.')  
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
      showToast.error('Failed to delete comment', 'Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const startEditingComment = (comment: Comment) => {
    setEditingComment(comment.id)
    setEditContent(comment.content)
    setReplyingTo(null) // Close any open reply forms
  }

  const handleCommentLike = async (commentId: string) => {
    if (!isSignedIn) return

    // Optimistic update
    const wasLiked = likedComments.has(commentId)
    setLikedComments(prev => {
      const newSet = new Set(prev)
      if (wasLiked) {
        newSet.delete(commentId)
      } else {
        newSet.add(commentId)
      }
      return newSet
    })

    try {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        setLikedComments(prev => {
          const newSet = new Set(prev)
          if (data.liked) {
            newSet.add(commentId)
          } else {
            newSet.delete(commentId)
          }
          return newSet
        })
        
        // Refresh comments to get updated like counts
        fetchComments()
        
        // Show success message
        showToast.success(
          data.liked ? 'Comment liked' : 'Comment unliked', 
          data.liked ? 'You liked this comment.' : 'You removed your like.'
        )
      } else {
        // Revert optimistic update on error
        setLikedComments(prev => {
          const newSet = new Set(prev)
          if (wasLiked) {
            newSet.add(commentId)
          } else {
            newSet.delete(commentId)
          }
          return newSet
        })
        showToast.error('Failed to like comment', 'Please try again.')
      }
    } catch (error) {
      // Revert optimistic update on error
      setLikedComments(prev => {
        const newSet = new Set(prev)
        if (wasLiked) {
          newSet.add(commentId)
        } else {
          newSet.delete(commentId)
        }
        return newSet
      })
      console.error('Error toggling comment like:', error)
      showToast.error('Failed to like comment', 'Please check your connection and try again.')
    }
  }

  // Fetch like status for comments when they load
  const fetchCommentLikeStatus = useCallback(async (commentIds: string[]) => {
    if (!isSignedIn || commentIds.length === 0) return

    try {
      const likeStatuses = await Promise.all(
        commentIds.map(async (commentId) => {
          const response = await fetch(`/api/comments/${commentId}/like`)
          if (response.ok) {
            const data = await response.json()
            return { commentId, liked: data.liked }
          }
          return { commentId, liked: false }
        })
      )

      const likedSet = new Set<string>()
      likeStatuses.forEach(({ commentId, liked }) => {
        if (liked) likedSet.add(commentId)
      })
      setLikedComments(likedSet)
    } catch (error) {
      console.error('Error fetching comment like statuses:', error)
      // Don't show toast for like status fetch errors as they're not critical
    }
  }, [isSignedIn])

  // Remove unused function
  // const fetchCommentsWithLikes = async () => {
  //   await fetchComments()
  // }

  useEffect(() => {
    if (comments.length > 0 && isSignedIn) {
      const allCommentIds = comments.flatMap(comment => [
        comment.id,
        ...comment.replies.map(reply => reply.id)
      ])
      fetchCommentLikeStatus(allCommentIds)
    }
  }, [comments, isSignedIn, fetchCommentLikeStatus])

  const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => (
    <div className={`${depth > 0 ? 'ml-3 border-l-2 border-gray-200 pl-3' : ''}`}>
      <div className="bg-background-secondary/30 rounded-lg p-3 mb-2">
        <div className="flex items-start gap-2 mb-2">
          <Avatar className="h-6 w-6 flex-shrink-0">
            <AvatarImage src={comment.user.avatarUrl} />
            <AvatarFallback className="text-xs">
              {comment.user.displayName?.charAt(0) || comment.user.username?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-xs truncate">
                {comment.user.displayName || comment.user.username}
              </span>
              <span className="text-xs text-gray-500 flex-shrink-0">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
        <div className="pl-8">
          {editingComment === comment.id ? (
            // Edit mode
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[60px] text-xs"
                placeholder="Edit your comment..."
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleEditComment(comment.id)}
                  disabled={submitting || !editContent.trim()}
                  className="text-xs h-6 px-2"
                >
                  {submitting ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingComment(null)
                    setEditContent('')
                  }}
                  className="text-xs h-6 px-2"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            // View mode
            <>
              <p className="text-xs mb-2 leading-relaxed">{comment.content}</p>
              
              {comment.tags && comment.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {comment.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs py-0.5 px-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                {/* Like button */}
                {isSignedIn && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCommentLike(comment.id)}
                    className={`h-5 px-1 flex items-center gap-1 min-w-0 ${
                      likedComments.has(comment.id) 
                        ? 'text-red-500 hover:text-red-600' 
                        : 'hover:text-red-500'
                    }`}
                  >
                    <Heart 
                      className={`h-3 w-3 flex-shrink-0 ${
                        likedComments.has(comment.id) ? 'fill-current' : ''
                      }`}
                    />
                    {(comment._count?.likes ?? 0) > 0 && (
                      <span className="tabular-nums text-xs">{comment._count?.likes}</span>
                    )}
                  </Button>
                )}
                
                {/* Reply button */}
                {isSignedIn && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="h-5 px-1 flex items-center gap-1 text-xs"
                  >
                    <MessageCircle className="h-3 w-3 flex-shrink-0" />
                    <span>Reply</span>
                  </Button>
                )}
                
                {/* Edit and Delete buttons for comment owner */}
                {isSignedIn && user?.id === comment.user.id && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditingComment(comment)}
                      className="h-5 px-1 text-xs"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteComment(comment.id)}
                      className="h-5 px-1 text-red-500 hover:text-red-700 text-xs"
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </>
          )}

          {replyingTo === comment.id && (
            <div className="mt-2 p-2 bg-background-secondary/20 rounded">
              <div className="space-y-2">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[50px] text-xs resize-none"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSubmitReply(comment.id)}
                    disabled={submitting || !replyContent.trim()}
                    className="text-xs h-6 px-2"
                  >
                    {submitting ? 'Posting...' : 'Reply'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setReplyingTo(null)
                      setReplyContent('')
                    }}
                    className="text-xs h-6 px-2"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Render replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div>
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-border-primary bg-background-secondary/50 flex-shrink-0">
        <h3 className="text-sm font-semibold">Comments ({comments.length})</h3>
      </div>

      {/* New comment form */}
      {isSignedIn && (
        <div className="border-b border-border-primary flex-shrink-0">
          <div className="p-3">
            <div className="space-y-3">
              <MentionInput
                placeholder="Add a comment..."
                value={newComment}
                onChange={setNewComment}
                className="min-h-[60px] text-sm resize-none"
                rows={3}
                maxLength={1000}
              />
              
              {/* Compact tags input */}
              <div className="space-y-2">
                {newCommentTags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {newCommentTags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs py-1">
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-500 text-sm leading-none"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addTag('design')}
                    disabled={newCommentTags.includes('design')}
                    className="h-6 px-2 text-xs"
                  >
                    + design
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addTag('feedback')}
                    disabled={newCommentTags.includes('feedback')}
                    className="h-6 px-2 text-xs"
                  >
                    + feedback
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addTag('question')}
                    disabled={newCommentTags.includes('question')}
                    className="h-6 px-2 text-xs"
                  >
                    + question
                  </Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={handleSubmitComment}
                  disabled={submitting || !newComment.trim()}
                  className="text-xs"
                >
                  {submitting ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comments list - Scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 px-4">
            <p className="text-sm">No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="space-y-2 p-3">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 