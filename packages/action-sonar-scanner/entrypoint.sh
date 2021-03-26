#!/usr/bin/env bash

# export SONAR_HOST_URL="http://abc"
# export SONAR_LOGIN="1234abcd"
# export GITHUB_REPOSITORY="repo/sample-project"
# # export GITHUB_REF="refs/heads/feature/abc"
# export GITHUB_REF="refs/pull/12/merge"
# export GITHUB_HEAD_REF="feature/abc"
# export GITHUB_BASE_REF="main"

function run-sonar-scanner() {
  export SONAR_PROJECTKEY=$(echo $GITHUB_REPOSITORY | tr '/' '_')
  export SONAR_HOST_URL=$SONAR_HOST_URL
  export SONAR_LOGIN=$SONAR_LOGIN
  export SONAR_PROJECTNAME=$(node -e console\.log\(require\(\'./package.json\'\).name\))
  export SONAR_PROJECTVERSION=$(node -e console\.log\(require\(\'./package.json\'\).version\))

  echo "::set-output name=SONAR_PROJECTKEY::$SONAR_PROJECTKEY"
  echo "::set-output name=SONAR_HOST_URL::$SONAR_HOST_URL"
  echo "::set-output name=SONAR_LOGIN::$SONAR_LOGIN"
  echo "::set-output name=SONAR_PROJECTNAME::$SONAR_PROJECTNAME"
  echo "::set-output name=SONAR_PROJECTVERSION::$SONAR_PROJECTVERSION"

  sonarScannerOptions=()

  if [[ $GITHUB_REF == refs\/pull\/* ]]; then
    A=($(echo $GITHUB_REF | tr "\/" "\n"))

    export SONAR_PULLREQUEST_KEY=${A[2]}
    export SONAR_PULLREQUEST_BRANCH=$GITHUB_HEAD_REF
    export SONAR_PULLREQUEST_BASE=$GITHUB_BASE_REF

    echo "::set-output name=SONAR_PULLREQUEST_KEY::$SONAR_PULLREQUEST_KEY"
    echo "::set-output name=SONAR_PULLREQUEST_BRANCH::$SONAR_PULLREQUEST_BRANCH"
    echo "::set-output name=SONAR_PULLREQUEST_BASE::$SONAR_PULLREQUEST_BASE"

    sonarScannerOptions+=(
      -Dsonar.pullrequest.key=$SONAR_PULLREQUEST_KEY
      -Dsonar.pullrequest.branch=$SONAR_PULLREQUEST_BRANCH
      -Dsonar.pullrequest.base=$SONAR_PULLREQUEST_BASE
    )
  elif [[ $GITHUB_REF ]]; then
    export SONAR_BRANCH_NAME=$(echo $GITHUB_REF | sed -e "s/^refs\/heads\///")

    echo "::set-output name=SONAR_BRANCH_NAME::$SONAR_BRANCH_NAME"

    sonarScannerOptions+=(
      -Dsonar.branch.name=$SONAR_BRANCH_NAME
    )
  fi

  # node -e console.log\(process.env,process.argv\) -- sonar-scanner ${sonarScannerOptions[@]}
  sonar-scanner ${sonarScannerOptions[@]}
}

run-sonar-scanner
